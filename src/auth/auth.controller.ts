import { Controller, Post, UseGuards, Request, HttpCode, HttpStatus, UseInterceptors, Inject } from '@nestjs/common'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local/local-auth.guard'
import { BasicAuthGuard } from './guards/basic-auth/basic-auth.guard'
import { BasicInterceptor } from './interceptors/basic_auth.interceptor'
import { PublicDecorator } from './decorator/public.decorator'
import { RefreshJwtAuthGuard } from './guards/jwt/refresh_jwt-auth.guard'
import { ConfigType } from '@nestjs/config'
import RefreshJwtConfig from '../config/refresh_jwt.config'
import { JwtSignOptions } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		@Inject(RefreshJwtConfig.KEY)
		private refreshJwtConfig: ConfigType<typeof RefreshJwtConfig>,
	) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@PublicDecorator()
	// @UseGuards(AuthGuard('local'))
	@Post('login')
	login(@Request() req) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return req.user
	}

	@ApiBasicAuth()
	@Post('signin')
	@UseGuards(BasicAuthGuard)
	@UseInterceptors(BasicInterceptor)
	@PublicDecorator()
	signIn(@Request() req) {
		const [tokenID, tokens] = this.authService.generateTokens(req.user)

		return this.userService.update(req.user.id, { tokenID: tokenID as string }).then(() => {
			return tokens
		})
	}

	@Post('refresh')
	@UseGuards(RefreshJwtAuthGuard)
	@PublicDecorator()
	refresh(@Request() req) {
		const refreshJwtSignOptions: JwtSignOptions = {
			algorithm: this.refreshJwtConfig.algorithm,
			expiresIn: this.refreshJwtConfig.expire_in,
			privateKey: this.refreshJwtConfig.PRIVATE_KEY,
		}
		const token = this.authService.generateToken(
			{
				sub: req.user.id,
				email: req.user.email,
				scope: req.user.scope,
				token_id: req.user.token_id,
				type: 'access',
			},
			refreshJwtSignOptions,
		)
		return {
			access_token: token,
		}
	}
	@ApiBearerAuth()
	@HttpCode(HttpStatus.OK)
	@Post('signout')
	async signOut(@Request() req) {
		await this.userService.update(req.user?.sub, { tokenID: null })
	}
}
