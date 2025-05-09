import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../../user/user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private userService: UserService,
		private configService: ConfigService,
	) {
		super({ usernameField: 'email' })
	}

	validate(email: string, password: string) {
		const prefix = this.configService.get<string>('password.PREFIX', { infer: true }) ?? ''
		return this.userService.validateUser(email, password, prefix)
	}
}
