import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorators";

@Injectable()
class RolesGuard implements CanActivate {


    constructor(private reflector: Reflector) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requeridRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requeridRoles) return true

        const { user } = context.switchToHttp().getResponse()

        return requeridRoles.includes(user.rol)
    }
}