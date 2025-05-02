import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { DbModule } from '../db/db.module'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'

@Module({
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
	imports: [DbModule],
})
export class UserModule {}
