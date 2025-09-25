import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleVentas } from './entities/venta.detalles.entity';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { time, timeStamp } from 'console';
import { Producto } from 'src/productos/entities/producto.entity';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.query.dto';
import { permisos } from 'src/helpers/validatorpermisos';
import { ESTADOVENTA } from 'src/enum/ventas.enum';
import { Http2ServerResponse } from 'http2';
import { validarTransicion } from 'src/helpers/validarEstado';

@Injectable()
export class VentasService {


  constructor(
    @InjectRepository(DetalleVentas)
    private readonly detallesReposiory: Repository<DetalleVentas>,
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>
  ) { }
  async addVenta(createVentaDto: CreateVentaDto, usuarioId: number) {
    try {
      const { detalles, ...ventaData } = createVentaDto

      //Guardar venta

      let newVenta = this.ventaRepository.create({
        ...ventaData,
        usuario: { id: usuarioId },
        total: 0
      })

      newVenta = await this.ventaRepository.save(newVenta)


      let total = 0

      let detallesGuardados: DetalleVentas[] = []

      for (let item of detalles) {
        //Buscar producto
        let producto = await this.productRepository.findOne({
          where: {
            id: item.productoId
          },
          relations: ['categoria']
        })
        if (!producto) {
          throw new NotFoundException(
            `Producto con id ${item.productoId} no existe`,
          );

        }

        if (item.cantidad > producto.stock) {
          throw new NotFoundException(`No hay suficiente stock para el producto ${producto.productName}`);
        }

        let precioxUnidad = Number(producto.price)
        //Calcular total
        total += precioxUnidad * item.cantidad



        //guardar detalles
        let detalle = this.detallesReposiory.create({
          cantidad: item.cantidad,
          precioUnitario: precioxUnidad,
          producto: { id: item.productoId } as Producto,
          venta: newVenta,

        })
        const guardarDetalles = await this.detallesReposiory.save(detalle)
        detallesGuardados.push(guardarDetalles)

      }

      //ACTUALIZAR TOTAL
      newVenta.total = total

      await this.ventaRepository.save(newVenta)
      return {
        message: 'Venta pendiente por confirmar',
        venta: newVenta,
        detalles: detallesGuardados
      }

    } catch (error) {
      Logger.error(error)
      if (error instanceof HttpException) {
        throw error

      }

      throw new HttpException('Internal Server', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async confirmarVentas(estado: ESTADOVENTA, rol: string, usurioId: number): Promise<Venta[]> {

    try {

      let ventas: Venta[] = []
      if (permisos(rol)) {
        ventas = await this.ventaRepository.find(
          {
            where: { estado },
            relations: ['usuario', 'detalles', 'detalles.producto']
          }
        )
      } else {
        if (estado != ESTADOVENTA.CONFIRMAR) {
          throw new ForbiddenException(
            'Los clientes solo pueden confirmar sus propias compras',
          );

        }
        ventas = await this.ventaRepository.find({
          where: { estado: ESTADOVENTA.PENDIENTE, usuario: { id: usurioId } }, relations: ['usuario', 'detalles', 'detalles.producto']
        })
      }


      if (ventas.length === 0) {
        throw new NotFoundException('No hay ventas pendientes para confirmar');
      }
      const ventasConfirmadas: Venta[] = []

      for (let venta of ventas) {
        venta.estado = ESTADOVENTA.CONFIRMAR
        await this.ventaRepository.save(venta)
        //Actualizar stock
        this.quitarStock(venta)
        ventasConfirmadas.push(venta)


      }

      return plainToInstance(Venta, ventasConfirmadas, { excludeExtraneousValues: true })
    } catch (error) {

      Logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error al confirmar las ventas pendientes',
      );
    }
  }

  async allVentas(pagination: PaginationDto) {
    try {
      const { limit = 5, page = 1 } = pagination; // valores por defecto

      const [ventas, total] = await this.ventaRepository.findAndCount({
        relations: ['usuario', 'detalles', 'detalles.producto'],
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' },
      });

      if (ventas.length === 0) {

        throw new NotFoundException('No hay ventas');
      }

      return {
        page,
        data: plainToInstance(Venta, ventas, { excludeExtraneousValues: true })
      };
    } catch (error) {
      Logger.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error al obtener las ventas',
      );
    }
  }


  //Cancelar venta
  async updateEstadoVenta(ventaId: number, usurioId: number, rol: string, nuevoEstado: ESTADOVENTA) {

    try {

      let venta: Venta | null = null
      //solo el admin puede cancelar la venta o el mismo usuario
      if (permisos(rol)) {

        venta = await this.ventaRepository.findOne({
          where: { id: ventaId },
          relations: ['usuario', 'detalles', 'detalles.producto']
        })

      } else {

        //EL cliente solo puuede cancelar compra
        if (nuevoEstado != ESTADOVENTA.CANCEL) {
          throw new ForbiddenException(
            'Los clientes solo pueden cancelar sus propias ventas',
          );
        }
        venta = await this.ventaRepository.findOne({
          where: {
            id: ventaId,
            usuario: { id: usurioId }
          },
          relations: ['usuario', 'detalles']
        })
      }

      if (!venta) {
        throw new NotFoundException(`Venta con ID ${ventaId} no está registrada en la base de datos`)
      }

      const estadoActual = venta.estado as ESTADOVENTA
      if (!validarTransicion(estadoActual, nuevoEstado)) {

        throw new BadRequestException(
          `No se puede cambiar el estado de ${estadoActual} a ${nuevoEstado}`,
        );
      }

      if (estadoActual === ESTADOVENTA.PAGADO && nuevoEstado === ESTADOVENTA.CANCEL) {
        this.ponerStock(venta)
      }

      venta.estado = nuevoEstado

      await this.ventaRepository.save(venta)

      return venta
    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('INTERNAL SERVER', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
  private async ponerStock(venta: Venta) {
    for (let detalle of venta.detalles) {
      const producto = detalle.producto
      producto.stock += detalle.cantidad
      await this.productRepository.save(producto)
    }
  }
  private async quitarStock(venta: Venta) {
    for (let detalle of venta.detalles) {
      const producto = detalle.producto
      producto.stock -= detalle.cantidad
      await this.productRepository.save(producto)
    }
  }

}



