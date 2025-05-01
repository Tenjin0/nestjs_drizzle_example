import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { IAuthJwtPayload } from './tyoes/jwt_payload'
import { TUser } from '../db/schema/users'
import { JwtSignOptions } from '@nestjs/jwt'
import JwtConfig from '../config/jwt.config'
import { ConfigService, ConfigType } from '@nestjs/config'
import { IJWTConfig } from '../config'
// import { TUser } from '../db/schema/users'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		@Inject(JwtConfig.KEY)
		private jwtConfig: ConfigType<typeof JwtConfig>,
		private configService: ConfigService,
	) {}
	findAll() {
		return `This action returns all auth`
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`
	}

	remove(id: number) {
		return `This action removes a #${id} auth`
	}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findByEmail(email)
		if (!user) throw new UnauthorizedException('User not found')
		const isPasswordMatch = await compare(password, user.password)
		if (!isPasswordMatch) throw new UnauthorizedException('Invalid Creditentials')

		return { ...user, password: undefined } //satisfies Partial<TUser>
	}

	generateToken(user: TUser) {
		console.log("generateToken", user)
		const payload: IAuthJwtPayload = {
			sub: user.id,
			email: user.email,
			scope: user.role.name,
		}
		// const jwtConfig = this.configService.get<IJWTConfig>('jwt')
		const jwtSignOptions: JwtSignOptions = {
			algorithm: this.jwtConfig.algorithm[0],
			expiresIn: this.jwtConfig.expire_in,
			privateKey: this.jwtConfig.PRIVATE_KEY,
		}
		return {
			access_token: this.jwtService.sign(payload, jwtSignOptions),
		}
	}
}
