import { Test, TestingModule } from '@nestjs/testing'
import { DeviceService } from './device.service'
// import { UpdateDeviceDto } from './dto/update-device.dto'
import { DRIZZLE } from '../db/db.module'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { TDevice } from '../db/schema/devices'
import { ETable } from '../common/enums/table.enum'

const mockedData = {
	id: 1,
} as Partial<TDevice> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.DEVICE)

describe('DeviceService', () => {
	let service: DeviceService
	beforeEach(async () => {
		// Getting instance from mock
		const module: TestingModule = await Test.createTestingModule({
			providers: [DeviceService, { provide: DRIZZLE, useValue: mockDrizzle }],
		}).compile()

		service = module.get<DeviceService>(DeviceService)
	})

	describe('findAll', () => {
		it('ls-fa-1.1 should return the list of locations when the findAll function is called', async () => {
			const expectedDevice = [mockedData]

			const result = await service.findAll()
			expect(result).toEqual(expectedDevice)
		})
	})
	describe('findOne', () => {
		it('ls-fo-1.1 should return the list of locations when the findAll function is called', async () => {
			const expectedDevice = mockedData

			const result = await service.findOne(expectedDevice.id)
			expect(result).toEqual(expectedDevice)
		})
	})
	describe('update', () => {
		it('ls-up-1.1 should return the list of locations when the findAll function is called', async () => {
			const updateDevice = { alias: 'test' }
			const expectedDevice = { id: 1, alias: updateDevice.alias, updatedAt: 'today' }

			const result = await service.update(expectedDevice.id, updateDevice)
			expect(result).toEqual(expectedDevice)
		})
	})
	describe('remove', () => {
		it('ls-re-1.1 should return the list of locations when the findAll function is called', async () => {
			const expectedDevice = { ...mockedData, deletedAt: 'today' }

			const result = await service.remove(expectedDevice.id)
			expect(result).toEqual(expectedDevice)
		})
	})
})
