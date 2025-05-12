import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { IServerConfig } from './config'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyHelmet from '@fastify/helmet'
import { setupSwagger } from './setup.swagger'
import { SocketService } from './socket/socket.service'
import { SocketIOAdapter } from './socket/socket.io.adapter'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

	setupSwagger(app)

	void app.register(fastifyHelmet, {
		xXssProtection: true,
		xDnsPrefetchControl: { allow: true },
		xContentTypeOptions: true,
	})

	app.setGlobalPrefix('api', { exclude: ['', 'auth/login', 'auth/signin', 'auth/refresh', 'auth/signout'] })

	const configService = app.get(ConfigService)
	const serverConfig = configService.get<IServerConfig>('server')

	app.useWebSocketAdapter(new SocketIOAdapter(app))

	await app.listen(serverConfig?.port ?? 3000, '0.0.0.0')

	const socketService = app.get(SocketService)
	socketService.createNamespaces().catch((err) => {
		console.error(err)
	})
}
void bootstrap()
