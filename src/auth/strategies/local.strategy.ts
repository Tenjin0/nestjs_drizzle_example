import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		private configService: ConfigService,
	) {
		super({ usernameField: 'email' })
	}

	validate(email: string, password: string) {
		const prefix = this.configService.get<string>('password.PREFIX', { infer: true }) ?? ''
		return this.authService.validateUser(email, password, prefix)
	}
}
