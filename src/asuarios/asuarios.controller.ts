import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AsuariosService } from './asuarios.service';
import { CreateAsuarioDto } from './dto/create-asuario.dto';
import { UpdateAsuarioDto } from './dto/update-asuario.dto';
import { JwtAuthGuard } from 'src/Guard/auth.guard';
import { RolesGuard } from 'src/Guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Request as ExpressRequest } from 'express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('usuarios')
export class AsuariosController {
  constructor(private readonly asuariosService: AsuariosService) { }




  @Post('addUser')
  async registeruser(@Body() createAsuarioDto: CreateAsuarioDto) {
    return this.asuariosService.register(createAsuarioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  findAll() {
    return this.asuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsuarioDto: UpdateAsuarioDto) {
    return this.asuariosService.update(+id, updateAsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asuariosService.remove(+id);
  }
}
