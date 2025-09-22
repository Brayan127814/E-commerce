import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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

  async confirmarVentas(estado: string): Promise<Venta[]> {

    try {
      const ventasPendientes = await this.ventaRepository.find(
        {
          where: { estado },
          relations: ['usuario', 'detalles', 'detalles.producto']
        }
      )

      if (ventasPendientes.length === 0) {
        throw new NotFoundException('No hay ventas pendientes para confirmar');
      }
      const ventasConfirmadas: Venta[] = []

      for (let venta of ventasPendientes) {
        venta.estado = 'pagado'
        await this.ventaRepository.save(venta)
        //Actualizar stock
        for (let detalle of venta.detalles) {

          const producto = detalle.producto
          producto.stock -= detalle.cantidad
          await this.productRepository.save(producto)

          ventasConfirmadas.push(venta)
        }


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
        data: plainToInstance(Venta,ventas,{excludeExtraneousValues:true})
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



}



