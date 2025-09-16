import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { permisos } from 'src/helpers/validatorpermisos';
import { lookup } from 'dns';
import { error } from 'console';
import { object } from 'joi';

@Injectable()
export class ProductosService {

  constructor(
    @InjectRepository(Producto)
    private readonly productService: Repository<Producto>
  ) { }
  async addProduct(createProductoDto: CreateProductoDto) {
    try {

      //Consultar todos los productos a la base de datos 
      //antes de registrar y no duplicar nombres

      const existingProduct = await this.productService.findOne({
        where: { productName: createProductoDto.productName },
        relations: ['categoria']
      })

      if (existingProduct) {
        throw new BadRequestException('Producto ya se encuentra registrado')
      }



      //Crear producto

      const newProducto = this.productService.create(createProductoDto)

      return {
        message: 'Produto registrado exitosamente',
        producto: await this.productService.save(newProducto)
      }
    } catch (error) {

      Logger.log('Error inesperado: ', error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('Internal Server', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
  // OBTENER TODOS LOS PRODUCTO
  async findAll(): Promise<Producto[] | undefined> {
    try {
      const products = await this.productService.find(
        {
          relations: ['categoria']
        }
      )

      return products
    } catch (error) {
      Logger.error('Error inesperado: ', error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('Internal Server', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async findOne(id: number): Promise<Producto | undefined> {
    try {
      const product = await this.productService.findOne({
        where: { id },
        relations: ['categoria']
      })
      if (!product) {
        throw new BadRequestException('Producto no encontrado')
      }

      return product
    } catch (error) {
      Logger.error('error', error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('Internal Server: ', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const product = await this.findOne(id)

      if (!product) {

        throw new NotFoundException(`Pronducto con id ${id} no encnotrado`)
      }
      //Actualizar compos
      Object.assign(product, updateProductoDto)

      const updateProduct = await this.productService.save(product)
      //Retornar produtocot actualizado


      return {
        message: 'Campos acutualizados',
        producto: updateProduct
      }
    } catch (error) {

      Logger.error('error', error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('Internal Server: ', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
