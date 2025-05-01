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
		console.log(isPublic)
		return true
		if (isPublic) return true // if not public it will not authorize request header without jwt token
		// const request = context.switchToHttp().getRequest()
		// const token = this.getToken(request)
		// return true
		return super.canActivate(context)
	}

	private getToken(request: Request) {
		// const [_, token] = request.headers.authorization?.split(' ') ?? []
		// return token
	}
}
