import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from './db/db.module'
import { ConfigModule } from '@nestjs/config'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module';
import configuration from './config'
import * as schema from './db/schema'
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
			load: [configuration(schema)],
		}),
		RoleModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
