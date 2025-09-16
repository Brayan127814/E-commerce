import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation,ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @ApiOperation({ summary: 'Login de usuario' })
    @ApiResponse({ status: 200, description: 'login exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales invalidas' })
    @Post('login')
    async loginSesion(@Body() loginData: LoginDto) {

        const { email, password } = loginData

        return this.authService.login(email, password)
    }
}
