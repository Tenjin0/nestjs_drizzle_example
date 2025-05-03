import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const setupSwagger = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle('Nestjs drizzle example')
		.setDescription('Rest api description')
		.setVersion('1.0')
		.addTag('NDE')
		// .addSecurity('basicAuth', {
		// 	type: 'http',
		// 	in: 'headder',
		// 	scheme: 'basic',
		// })
		// .addSecurityRequirements('basicAuth')
		.addBearerAuth({ type: 'http', scheme: 'bearer' })
		.addBasicAuth({ type: 'http', in: 'header' })
		.addOAuth2()
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, documentFactory)
}
