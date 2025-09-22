import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsuariosModule } from './asuarios/asuarios.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './asuarios/entities/asuario.entity';
import { Roles } from './asuarios/entities/rol.entity';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { Producto } from './productos/entities/producto.entity';
import { Categoria } from './categorias/entities/categoria.entity';
import { VentasModule } from './ventas/ventas.module';
import { Venta } from './ventas/entities/venta.entity';
import { DetalleVentas } from './ventas/entities/venta.detalles.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('BD_HOST'),
        username: config.get<string>('BD_USER'),
        password: config.get<string>('BD_PASSWORD'),
        port: config.get<number>('BD_PORT'),
        database: config.get<string>('BD_DATABASE'),
        entities: [Usuario, Roles, Producto, Categoria, Venta,DetalleVentas],
        synchronize: false

      })
    }),




    AsuariosModule,




    AuthModule,




    ProductosModule,




    CategoriasModule,




    VentasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
