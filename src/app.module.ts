import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from './db/db.module'
import { ConfigModule } from '@nestjs/config'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import dbConfig from './config/db.config'
import serverConfig from './config/server.config'
import hashConfig from './config/hash.config'
import passwordConfig from './config/password.config'
import drizzleConfig from './config/drizzle.config'
import jwtConfig from './config/jwt.config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt/jwt-auth.guard'
import refreshJwtConfig from './config/refresh_jwt.config'

@Module({
	imports: [
		DbModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				'.env.' + process.env.NODE_ENV + '.local',
				'.env.' + process.env.NODE_ENV,
				'.env.dist',
				'.env',
			],
			expandVariables: true,
			load: [serverConfig, dbConfig, hashConfig, passwordConfig, drizzleConfig, jwtConfig, refreshJwtConfig],
		}),
		RoleModule,
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
