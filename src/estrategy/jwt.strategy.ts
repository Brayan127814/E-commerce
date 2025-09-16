import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor( config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('APIKEY') || 'balkfjapkfjaksjdfpasjdlkfjaio'
        })
    }

    validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
            rol: payload.rol
        }
    }
}