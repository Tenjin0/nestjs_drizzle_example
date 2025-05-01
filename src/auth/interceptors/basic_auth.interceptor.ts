import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from '../auth.service'

export class BasicInterceptor implements NestInterceptor {
	constructor(
		@Inject(AuthService)
		private authService: AuthService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest()
		console.log('intercept', request.creditentials)
		const user = await this.authService.validateUser(request.creditentials.email, request.creditentials.password)
		console.log('intercept', user)
		request.user = user
		// throw new BadRequestException('TOTO')
		return next.handle()
	}
}
