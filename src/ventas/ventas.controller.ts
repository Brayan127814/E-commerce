import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
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
import { ESTADOVENTA } from 'src/enum/ventas.enum';
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) { }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  @Post('addVenta')
  create(@Body() createVentaDto: CreateVentaDto, @Request() req: expressRequest & { user: { id: number, rol: string } }) {


    const usuarioId = req.user.id
    return this.ventasService.addVenta(createVentaDto, usuarioId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  @Patch('confirmar')
  async confirmarVentas(@Request() req: expressRequest & { user: { id: number, rol: string } }): Promise<Venta[]> {
    return this.ventasService.confirmarVentas(ESTADOVENTA.CONFIRMAR, req.user.rol, req.user.id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  @Get()
  async ventasAll(@Query() paginationDto: PaginationDto) {

    return await this.ventasService.allVentas(paginationDto)

  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cliente')
  @Patch(':id/estado')
  async updateVentaEstado(
    @Param('id', ParseIntPipe) ventaId: number,
    @Body('estado') nuevoEstado: ESTADOVENTA,
    @Request() req: expressRequest & { user: { id: number; rol: string } },
  ) {
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    return this.ventasService.updateEstadoVenta(
      ventaId,
      usuarioId,
      rol,
      nuevoEstado,
    );
  }

}
