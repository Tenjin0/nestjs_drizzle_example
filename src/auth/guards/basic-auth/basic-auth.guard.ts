import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()

		if (!request.headers) {
			throw new BadRequestException('Missing headers in request 0_o')
		}
		// console.log(request.headers)
		if (!request.headers?.authorization) {
			throw new BadRequestException('Missing authorization in headers request')
		}
		const authorization: string = request.headers.authorization
		console.log(authorization)
		if (!authorization.startsWith('Basic')) {
			throw new BadRequestException('Missing Basic prefix in authorization header')
		}
		const authorizationSplit = authorization.split(' ')
		if (authorizationSplit.length < 2) {
			throw new BadRequestException('Missing token after Basic in header.authorization')
		}
		const token = Buffer.from(authorizationSplit[1], 'base64').toString()
		console.log(token)
		const creditentials = token.split(':')
		if (creditentials.length < 2) {
			throw new BadRequestException('Invalid creditential in header.authorization')
		}
		request.creditentials = {
			email: creditentials[0],
			password: creditentials[1],
		}

		// instead of interceptor calling validateUser here
		return true
	}

	validate() {
		console.log('validate')
	}
}
