import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './strategies/local.strategy'
import { UserService } from '../user/user.service'
import { DbModule } from '../db/db.module'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { ConfigService, ConfigType } from '@nestjs/config'
import JwtConfig from '../config/jwt.config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshJwtStrategy } from './strategies/refresh_jwt.strategiy'

@Module({
	imports: [
		UserModule,
		DbModule,
		JwtModule.registerAsync({
			useFactory(config: ConfigType<typeof JwtConfig>) {
				const options: JwtModuleOptions = {
					privateKey: config.PRIVATE_KEY,
					publicKey: config.PUBLIC_KEY,
					signOptions: {
						algorithm: 'RS256',
						issuer: '',
						expiresIn: config.expire_in,
					},
				}
				return options
			},
			inject: [ConfigService],
		}),
	],

	controllers: [AuthController],
	providers: [UserService, AuthService, JwtStrategy, LocalStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
