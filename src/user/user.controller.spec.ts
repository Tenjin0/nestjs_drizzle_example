import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { ETable } from '../common/enums/table.enum'
import { TUser } from '../db/schema/users'
import { DRIZZLE } from '../db/db.module'

const mockedData = {
	id: 1,
	name: 'test',
} as Partial<TUser> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.USER)

describe('UserController', () => {
	let controller: UserController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService, { provide: DRIZZLE, useValue: mockDrizzle }],
		}).compile()

		controller = module.get<UserController>(UserController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
