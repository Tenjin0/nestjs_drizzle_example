import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { TUser } from '../db/schema/users'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { ETable } from '../common/enums/table.enum'
import { DRIZZLE } from '../db/db.module'

const mockedData = {
	id: 1,
	name: 'test',
} as Partial<TUser> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.LOCATION)

describe('UserService', () => {
	let service: UserService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService, { provide: DRIZZLE, useValue: mockDrizzle }],
		}).compile()

		service = module.get<UserService>(UserService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
