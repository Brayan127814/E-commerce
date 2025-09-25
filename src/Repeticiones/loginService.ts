import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AsuariosService } from "src/asuarios/asuarios.service";
import * as bcrypt from 'bcrypt'
@Injectable()
class LoginService {
    constructor(
        private readonly usuarioService: AsuariosService,
        private readonly jwtService: JwtService
    ) {
    }


    //Metodo para logueo y generar token

    async Login(email: string, password: string) {
        const user = await this.usuarioService.emailUser(email)
        if (!user) {
            throw new NotFoundException()
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new NotFoundException('Credenciales incorrectas')
        }

        //crear payload
        const payload = { sub: user.id, email: user.email, rol: user.rol.roleName }
        //Generar token

        const token = this.jwtService.sign(payload)

        return {
            success: true,
            token
        }
    }
}