import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { ERole } from '../types/role.enum'
import { ROLES_KEY } from '../decorators/role.decorator'
import { IAuthJwtPayload } from '../../auth/types/jwt_payload'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (!requiredRoles) {
			return true
		}
		const user = context.switchToHttp().getRequest().user as IAuthJwtPayload

		const hasRequiredRole = requiredRoles.some((role) => user.scope === role)
		return hasRequiredRole
	}
}
