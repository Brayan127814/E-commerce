import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAsuarioDto } from './dto/create-asuario.dto';
import { UpdateAsuarioDto } from './dto/update-asuario.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/asuario.entity';
import { Repository } from 'typeorm';
import { use } from 'passport';
import { plainToInstance } from 'class-transformer';
import { NotFoundError } from 'rxjs';
@Injectable()
export class AsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosServices: Repository<Usuario>
  ) { }
  async register(createAsuarioDto: CreateAsuarioDto) {
    try {
      const hasPassword = await bcrypt.hash(createAsuarioDto.password, 10)
      const user = this.usuariosServices.create({

        ...createAsuarioDto,

        password: hasPassword
      })

      const newUsuario = this.usuariosServices.save(user)

      return plainToInstance(Usuario, newUsuario, { excludeExtraneousValues: true })

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('Internal server', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  /**
   * 
   * @returns 
   * 
   * OBTENER  EMAIL PARA USAR EL LOGIN
   */

  async emailUser(email: string) {

    try {
      const user = await this.usuariosServices.findOne({
        where: { email },
        relations: ['rol']
      })

      if (!user) {

        throw new NotFoundException('Usuario no encontrado')

      }

      return user
    } catch (error) {

      if (error instanceof HttpException) {

        throw error
      }

      throw new HttpException('Internal Server', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }
  findAll() {
    return `This action returns all asuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asuario`;
  }

  update(id: number, updateAsuarioDto: UpdateAsuarioDto) {
    return `This action updates a #${id} asuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} asuario`;
  }
}
