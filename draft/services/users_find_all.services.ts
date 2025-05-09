import { initDB, configService } from '../_init'
import { UserService } from '../../src/user/user.service'
import { ConfigService } from '@nestjs/config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
void initDB(async (db, close) => {
	const userService = new UserService(configService as ConfigService, db)
	const result = await userService.findAll()
	// eslint-disable-next-line no-console
	console.log(result)
})
