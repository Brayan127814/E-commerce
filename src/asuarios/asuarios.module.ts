import { Module } from '@nestjs/common';
import { AsuariosService } from './asuarios.service';
import { AsuariosController } from './asuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/asuario.entity';
import { Roles } from './entities/rol.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario, Roles])],
  controllers: [AsuariosController],
  providers: [AsuariosService],
  exports:[AsuariosService]
})
export class AsuariosModule {}
