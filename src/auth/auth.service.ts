import { HttpException, HttpStatus, Injectable, NotFoundException,  UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsuariosService } from 'src/asuarios/asuarios.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: AsuariosService) { }

    
    async login(email: string, password: string) {


        try {
            const user = await this.userService.emailUser(email)

            if (!user) {
                throw new NotFoundException()
            }

            const isMath = await bcrypt.compare(password, user.password)

            if (!isMath) {
                throw new NotFoundException('NO encontrado')
            }

            //Crear payload

            const payload = { sub: user.id, name: user.name, email: user.email, rol: user.rol.roleName }

            //Generar token
            const token = this.jwtService.sign(payload)

            return {
                success: true,
                token
            }
        } catch (error) {
            console.log('error', error)
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException('Error interno del servidor  ', HttpStatus.INTERNAL_SERVER_ERROR)

        }



    }
}
