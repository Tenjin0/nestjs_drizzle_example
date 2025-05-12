import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigType } from '@nestjs/config'
import { BadRequestException, Inject, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { IAuthJwtPayload } from '../types/jwt_payload'
import RefreshJwtConfig from '../../config/refresh_jwt.config'

export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh_jwt') {
	private refreshJwtConfig: ConfigType<typeof RefreshJwtConfig>

	constructor(
		@Inject(UserService)
		private userService: UserService,
		@Inject(RefreshJwtConfig.KEY)
		refreshJwtConfig: ConfigType<typeof RefreshJwtConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: refreshJwtConfig.PUBLIC_KEY,
			algorithms: [refreshJwtConfig.algorithm],
		})
		this.refreshJwtConfig = refreshJwtConfig
	}
	async validate(payload: any) {
		const { sub: idUser, type, token_id: tokenID } = payload as IAuthJwtPayload
		if (type !== 'refresh') {
			throw new UnauthorizedException('Wrong token')
		}

		const user = await this.userService.findOne(idUser)
		if (!user?.tokenID || tokenID !== user?.tokenID) {
			throw new BadRequestException('Invalid refresh token')
		}

		return {
			id: user?.id,
			email: user?.email,
			role: user?.role.name,
		}
	}
}
