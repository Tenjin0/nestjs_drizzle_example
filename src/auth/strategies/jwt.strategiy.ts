import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import JwtConfig from '../../config/jwt.config'
import { ConfigType } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { UserService } from '../../user/user.service'

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		@Inject(UserService)
		private userService: UserService,
		@Inject(JwtConfig.KEY)
		jwtConfig: ConfigType<typeof JwtConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfig.PUBLIC_KEY,
			algorithms: jwtConfig.algorithm,
		})
	}
	async validate(payload: any) {
		const { email } = payload
		console.log('validate', payload)
		const user = await this.userService.findByEmail(email)
		return {
			id: user?.id,
			email: user?.email,
			role: user?.role.name,
		}
	}
}
