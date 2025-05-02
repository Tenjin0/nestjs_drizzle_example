import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

export const ISPUBLIC = 'IS_PUBLIC'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super()
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(ISPUBLIC, [context.getHandler(), context.getClass()])
		console.log('jwt', isPublic)
		if (isPublic) return true // if not public it will not authorize request header without jwt token
		return super.canActivate(context)
	}


}
