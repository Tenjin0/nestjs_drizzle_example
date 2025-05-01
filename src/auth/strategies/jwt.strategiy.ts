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
		private jwtConfig: ConfigType<typeof JwtConfig>,
	) {
		console.log(jwtConfig)
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfig.PUBLIC_KEY,
			algorithms: jwtConfig.algorithm,
		})
	}
	async validate(payload: any) {
		console.log('validate: jwt', payload)
		const user = await this.userService.findByEmail(payload.email)
		console.log('validate', payload)
		return {
			id: user?.id,
			email: user?.email,
			role: user?.role.name,
		}
	}
}
