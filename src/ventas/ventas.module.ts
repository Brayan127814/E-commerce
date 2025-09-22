import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVentas } from './entities/venta.detalles.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Venta,DetalleVentas, Producto])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
