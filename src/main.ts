import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { IServerConfig } from './config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api', { exclude: ['auth/login', 'auth/signin', 'auth/refresh'] })

	const configService = app.get(ConfigService)
	const serverConfig = configService.get<IServerConfig>('server')
	await app.listen(serverConfig?.port ?? 3000)
}
void bootstrap()
