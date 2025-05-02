import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import JwtConfig from '../../config/jwt.config'
import { ConfigType } from '@nestjs/config'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { IAuthJwtPayload } from '../types/jwt_payload'

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		@Inject(UserService)
		private userService: UserService,
		@Inject(JwtConfig.KEY)
		jwtConfig: ConfigType<typeof JwtConfig>,
	) {
		console.log(jwtConfig)
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfig.PUBLIC_KEY,
			algorithms: [jwtConfig.algorithm],
		})
	}
	async validate(payload: any) {
		const { email, type } = payload as IAuthJwtPayload
		if (type !== 'refresh') {
			throw new UnauthorizedException('Wrong token')
		}
		const user = await this.userService.findByEmail(email)
		return {
			id: user?.id,
			email: user?.email,
			role: user?.role.name,
		}
	}
}
