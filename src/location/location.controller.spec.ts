import { Test, TestingModule } from '@nestjs/testing'
import { LocationController } from './location.controller'
import { LocationService } from './location.service'
import { DRIZZLE } from '../db/db.module'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { TLocation } from '../db/schema/locations'
import { ETable } from '../common/enums/table.enum'

const mockedData = {
	id: 1,
	namespace: 'test',
} as Partial<TLocation> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.LOCATION)

describe('LocationController', () => {
	let controller: LocationController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LocationController],
			providers: [LocationService, { provide: DRIZZLE, useValue: mockDrizzle }],
		}).compile()

		controller = module.get<LocationController>(LocationController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
