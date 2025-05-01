import { Controller, Post, UseGuards, Request, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local/local-auth.guard'
import { BasicAuthGuard } from './guards/basic-auth/basic-auth.guard'
import { BasicInterceptor } from './interceptors/basic_auth.interceptor'
import { PublicDecorator } from './decorator/public.decorator'

@PublicDecorator()
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@PublicDecorator()
	// @UseGuards(AuthGuard('local'))
	@Post('login')
	login(@Request() req) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return req.user
	}

	@Post('signin')
	@UseGuards(BasicAuthGuard)
	@UseInterceptors(BasicInterceptor)
	@PublicDecorator()
	signIn(@Request() req) {
		const token = this.authService.generateToken(req.user)
		return token
	}
}
