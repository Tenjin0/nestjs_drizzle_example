import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { UserService } from '../../../user/user.service'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { IJWTConfig } from '../../../config'
import { IAuthJwtPayload } from '../../types/jwt_payload'
export const ISPUBLIC = 'IS_PUBLIC'
@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh_jwt') {
	constructor(
		private reflector: Reflector,
		private userService: UserService,
		private configService: ConfigService,
	) {
		super()
	}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(ISPUBLIC, [context.getHandler(), context.getClass()])
		console.log('refresh jwt', isPublic)
		const request = context.switchToHttp().getRequest()
		const token = this.getToken(request)
		console.log(token)

		const refreshJwtConfig = this.configService.get<IJWTConfig>('refresh_jwt') as IJWTConfig
		const decoded = jwt.verify(token, refreshJwtConfig?.PRIVATE_KEY, {
			algorithms: [refreshJwtConfig.algorithm],
		}) as unknown as IAuthJwtPayload
		const user = await this.userService.findOne(decoded.sub)
		console.log(decoded, user)
		if (decoded.token_id !== user?.tokenID) {
			throw new BadRequestException('Invalid refresh token')
		}
		return super.canActivate(context) as Promise<boolean>
	}

	private getToken(request: any) {
		console.log('get token')
		if (!request.headers) {
			throw new BadRequestException('Missing headers in request 0_o')
		}
		// console.log(request.headers)
		if (!request.headers?.authorization) {
			throw new BadRequestException('Missing authorization in headers request')
		}
		const [_, token] = request.headers.authorization.split(' ') ?? []
		return token
	}
}
