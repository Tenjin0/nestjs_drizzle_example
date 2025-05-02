import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from '../auth.service'
import { ConfigService } from '@nestjs/config'
export class BasicInterceptor implements NestInterceptor {
	constructor(
		@Inject(AuthService)
		private authService: AuthService,
		private configService: ConfigService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest()
		const prefix = this.configService.get('password.PREFIX', { infer: true }) ?? ''
		const user = await this.authService.validateUser(
			request.creditentials.email,
			request.creditentials.password,
			prefix,
		)
		request.user = user
		// throw new BadRequestException('TOTO')
		return next.handle()
	}
}
