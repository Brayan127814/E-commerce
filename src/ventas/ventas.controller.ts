import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Express as expressRequest } from 'express'
import { Request } from '@nestjs/common';
import { use } from 'passport';
import { JwtAuthGuard } from 'src/Guard/auth.guard';
import { RolesGuard } from 'src/Guard/roles.guard';
import { Venta } from './entities/venta.entity';
import { Roles } from 'src/decorators/roles.decorators';
import { PaginationDto } from 'src/common/dto/pagination.query.dto';
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) { }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('addVenta')
  create(@Body() createVentaDto: CreateVentaDto, @Request() req: expressRequest & { user: { id: number, rol: string } }) {


    const usuarioId = req.user.id
    return this.ventasService.addVenta(createVentaDto, usuarioId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('confirmar')
  async confirmarVentas(): Promise<Venta[]> {
    return this.ventasService.confirmarVentas('pendiente');
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async ventasAll(@Query() paginationDto: PaginationDto) {

    return await this.ventasService.allVentas(paginationDto)

  }

}
