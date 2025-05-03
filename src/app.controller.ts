import { Controller, Get, Redirect } from '@nestjs/common'
import { AppService } from './app.service'
import { PublicDecorator } from './auth/decorator/public.decorator'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Redirect('api', 301)
	@Get()
	@PublicDecorator()
	getHello(): string {
		return this.appService.getHello()
	}
}
