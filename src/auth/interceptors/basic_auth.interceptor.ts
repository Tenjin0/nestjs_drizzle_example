import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../../user/user.service'
export class BasicInterceptor implements NestInterceptor {
	constructor(
		@Inject(UserService)
		private userService: UserService,
		private configService: ConfigService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest()
		const prefix = this.configService.get('password.PREFIX', { infer: true }) ?? ''
		const user = await this.userService.validateUser(request.body.email, request.body.password, prefix)
		request.user = user
		// throw new BadRequestException('TOTO')
		return next.handle()
	}
}
