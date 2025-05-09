import { Test, TestingModule } from '@nestjs/testing'
import { DeviceController } from './device.controller'
import { DeviceService } from './device.service'
import { TDevice } from '../db/schema/devices'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { ETable } from '../common/enums/table.enum'
import { DRIZZLE } from '../db/db.module'

const mockedData = {
	id: 1,
} as Partial<TDevice> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.DEVICE)
describe('DeviceController', () => {
	let controller: DeviceController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeviceController],
			providers: [DeviceService, { provide: DRIZZLE, useValue: mockDrizzle }],
		}).compile()

		controller = module.get<DeviceController>(DeviceController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
