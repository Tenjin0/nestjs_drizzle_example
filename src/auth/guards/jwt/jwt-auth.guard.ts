import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super()
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		console.log('jwt guard')
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
			context.getHandler(),
			context.getClass(),
		])

		console.log('isPublic', isPublic)
		if (isPublic) return true // if not public it will not authorize request header without jwt token
		const request = context.switchToHttp().getRequest()
		// const token = this.getToken(request)
		// return true
		return super.canActivate(context)
	}

	private getToken(request: Request) {
		// const [_, token] = request.headers.authorization?.split(' ') ?? []
		// return token
	}
}
