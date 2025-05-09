import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import jwtConfig from '../config/jwt.config'
import refresh_jwtConfig from '../config/refresh_jwt.config'
import { rawConfig } from '../config/raw.config'
import * as schema from '../../src/db/schema'
import { UserService } from '../user/user.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { ETable } from '../common/enums/table.enum'
import { TUser } from '../db/schema/users'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { DRIZZLE } from '../db/db.module'
const mockedData = {
	id: 1,
	name: 'test',
} as Partial<TUser> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.USER)
describe('AuthController', () => {
	let controller: AuthController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				AuthService,
				UserService,
				{ provide: JwtService, useValue: jest.fn() },
				{ provide: jwtConfig.KEY, useValue: rawConfig(schema).jwt },
				{ provide: refresh_jwtConfig.KEY, useValue: rawConfig(schema).refresh_jwt },
				JwtStrategy,
				ConfigService,
				{ provide: DRIZZLE, useValue: mockDrizzle },
			],
		}).compile()

		controller = module.get<AuthController>(AuthController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
