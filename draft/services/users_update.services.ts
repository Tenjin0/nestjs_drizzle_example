import { initDB } from '../_init'
import { configService } from '../../src/common/test/_init'
import { UserService } from '../../src/user/user.service'
import { ConfigService } from '@nestjs/config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
void initDB(async (db, _close) => {
	const userService = new UserService(configService as ConfigService, db)
	await userService.findAll()
})
