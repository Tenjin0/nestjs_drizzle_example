import { Inject, Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { JwtService } from '@nestjs/jwt'

import { IAuthJwtPayload } from './types/jwt_payload'
import { TUser } from '../db/schema/users'
import { JwtSignOptions } from '@nestjs/jwt'
import JwtConfig from '../config/jwt.config'
import RefreshJwtConfig from '../config/refresh_jwt.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@Inject(JwtConfig.KEY)
		private jwtConfig: ConfigType<typeof JwtConfig>,
		@Inject(RefreshJwtConfig.KEY)
		private refreshJwtConfig: ConfigType<typeof JwtConfig>,
	) {}

	generateAccessToken(payload: IAuthJwtPayload) {
		const jwtSignOptions: JwtSignOptions = {
			algorithm: this.jwtConfig.algorithm,
			expiresIn: this.jwtConfig.expire_in,
			privateKey: this.jwtConfig.PRIVATE_KEY,
		}
		return this.generateToken(payload, jwtSignOptions)
	}

	generateRefreshToken(payload: IAuthJwtPayload) {
		const refreshJwtSignOptions: JwtSignOptions = {
			algorithm: this.refreshJwtConfig.algorithm,
			expiresIn: this.refreshJwtConfig.expire_in,
			privateKey: this.refreshJwtConfig.PRIVATE_KEY,
		}
		return this.generateToken(payload, refreshJwtSignOptions)
	}

	generateToken(payload: IAuthJwtPayload, jwtSignOptions: JwtSignOptions) {
		return this.jwtService.sign(payload, jwtSignOptions)
	}

	generateTokens(user: TUser) {
		const tokenID = this.generateTokenId()
		const payload: IAuthJwtPayload = {
			sub: user.id,
			email: user.email,
			token_id: tokenID,
			scope: user.role.name,
			type: 'access',
		}

		// const jwtConfig = this.configService.get<IJWTConfig>('jwt')
		const jwtSignOptions: JwtSignOptions = {
			algorithm: this.jwtConfig.algorithm,
			expiresIn: this.jwtConfig.expire_in,
			privateKey: this.jwtConfig.PRIVATE_KEY,
		}
		// const jwtConfig = this.configService.get<IJWTConfig>('jwt')
		const refreshJwtSignOptions: JwtSignOptions = {
			algorithm: this.refreshJwtConfig.algorithm,
			expiresIn: this.refreshJwtConfig.expire_in,
			privateKey: this.refreshJwtConfig.PRIVATE_KEY,
		}
		return [
			payload.token_id,
			{
				access_token: this.generateToken(payload, jwtSignOptions),
				refresh_token: this.generateToken(
					{ ...payload, type: 'refresh' } as IAuthJwtPayload,
					refreshJwtSignOptions,
				),
			},
		]
	}

	generateTokenId() {
		const inputString = uuidv4()
		const buffer = Buffer.from(inputString, 'utf8')
		return buffer.toString('base64')
	}

	// async findUserById(id: number) {
	// 	const user = await this.userService.findOne(id)
	// 	return user
	// }
}
