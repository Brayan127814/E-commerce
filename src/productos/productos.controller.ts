import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/Guard/auth.guard';
import { RolesGuard } from 'src/Guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('addProducto')
  async registerProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.addProduct(createProductoDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('all')
  async allProducto() {
    return this.productosService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
