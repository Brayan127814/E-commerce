import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/asuarios/entities/asuario.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { CreateVentaDto } from "src/ventas/dto/create-venta.dto";
import { DetalleVentas } from "src/ventas/entities/venta.detalles.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Not, Repository } from "typeorm";


@Injectable()

class VentasService {

    constructor(
        @InjectRepository(Venta)
        private readonly ventaRepsitory: Repository<Venta>,

        @InjectRepository(DetalleVentas)
        private readonly detallesRepository: Repository<DetalleVentas>,

        @InjectRepository(Producto)
        private readonly productRepository: Repository<Producto>
    ) { }



    async crearVenta(createVentaDto: CreateVentaDto, usuarioid: number) {

        try {

            const { detalles, ...ventaData } = createVentaDto

            //Crear venta
            let venta = await this.ventaRepsitory.create({
                ...ventaData,
                usuario: { id: usuarioid },
                total: 0
            })

            //guardar la venta en la base de datos


            venta = await this.ventaRepsitory.save(venta)
            let total = 0
            let detallesGuardados: DetalleVentas[] = []

            for (let item of detalles) {
                //Buscar el producto para relacionarlo en la base de datos
                const producto = await this.productRepository.findOne(
                    {
                        where: { id: item.productoId }, relations: ['categoria']
                    },

                )

                if (!producto) {
                    throw new NotFoundException(`Producto con ID ${item.productoId} no está en la base de datos`)
                }

                //Validar el stock
                if (producto.stock < item.cantidad) {
                    throw new NotFoundException(`No hay stock suficienta en la base de datos`)
                }
                //calcular total
                let precioxUnidad = producto.price
                total += precioxUnidad * item.cantidad

                //crear los detalles de la compra
                const detalle = this.detallesRepository.create({
                    cantidad: item.cantidad,
                    precioUnitario: precioxUnidad,
                    producto: { id: item.productoId } as Producto,
                    venta: venta

                })

                //Guardar los detalles en la base de datos
                const saveDetails = await this.detallesRepository.save(detalle)
                detallesGuardados.push(saveDetails)
            }
            //ACTUALIZAR TOTAL
            venta.total = total
            await this.ventaRepsitory.save(venta)

            return {
                message: 'Venta pendiente por confirmar',
                venta: venta,
                detalles: detallesGuardados
            }
        } catch (error) {

            Logger.error(error)
            if (error instanceof HttpException) {
                throw error
            }

            throw new HttpException('INTERNAL SERVER', HttpStatus.INTERNAL_SERVER_ERROR)

        }
    }
}