import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AsuariosModule } from 'src/asuarios/asuarios.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/estrategy/jwt.strategy';

@Module({
  imports:[

    AsuariosModule,
    ConfigModule,

    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (config:ConfigService)=>({

        global:true,
        secret: config.get<string>('APIKEY'),
        signOptions:{expiresIn:'1h'}
      })
    })
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
