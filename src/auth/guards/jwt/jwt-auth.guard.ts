import { BadRequestException, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import * as jwt from 'jsonwebtoken'
import JwtConfig from '../../../config/jwt.config'
import { ConfigType } from '@nestjs/config'
import { JwtStrategy } from '../../strategies/jwt.strategy'
export const ISPUBLIC = 'IS_PUBLIC'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private reflector: Reflector,
		@Inject(JwtConfig.KEY)
		private jwtConfig: ConfigType<typeof JwtConfig>,
		@Inject(JwtStrategy)
		private jwtStragegy: JwtStrategy,
	) {
		super()
	}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(ISPUBLIC, [context.getHandler(), context.getClass()])
		if (isPublic) return true // if not public it will not authorize request header without jwt token
		const request = context.switchToHttp().getRequest()

		const token = this.getToken(request)
		try {
			const decoded = jwt.verify(token, this.jwtConfig.PRIVATE_KEY, { algorithms: [this.jwtConfig.algorithm] })
			request.user = decoded
			await this.jwtStragegy.validate(decoded)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			// console.error(err)
			const error = new UnauthorizedException('Invalid access token')
			// error['data'] = err
			throw error
		}
		return true
	}

	private getToken(request: any) {
		if (!request.headers) {
			throw new BadRequestException('Missing headers in request 0_o')
		}
		// console.log(request.headers)
		if (!request.headers?.authorization) {
			throw new BadRequestException('Missing authorization in headers request')
		}
		const [, token] = request.headers.authorization.split(' ') ?? []
		return token as string
	}
}
