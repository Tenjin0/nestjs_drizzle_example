import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import JwtConfig from '../../config/jwt.config'
import { ConfigType } from '@nestjs/config'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { IAuthJwtPayload } from '../types/jwt_payload'

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		@Inject(JwtConfig.KEY)
		jwtConfig: ConfigType<typeof JwtConfig>,
		private userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfig.PUBLIC_KEY,
			algorithms: [jwtConfig.algorithm],
		})
	}
	async validate(payload: any) {
		const { type, sub: idUser, token_id: tokenID } = payload as IAuthJwtPayload
		if (type !== 'access') {
			throw new UnauthorizedException('Wrong token')
		}
		const user = await this.userService.findOne(idUser)
		if (!user?.tokenID) {
			throw new UnauthorizedException('Token no longer valid')
		}
		if (tokenID !== user?.tokenID) {
			throw new UnauthorizedException('Token must have been revoked')
		}
		return {
			id: user?.id,
			email: user?.email,
			role: user?.role.name,
		}
	}
}
