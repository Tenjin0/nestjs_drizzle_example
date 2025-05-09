import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/create-location.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { DRIZZLE } from '../db/db.module'
import { TLocation } from '../db/schema/locations'
import { dbFactory } from '../common/abstracts/db.factory.mock'
import { ETable } from '../common/enums/table.enum'

const mockedData = {
	id: 1,
	namespace: 'test',
} as Partial<TLocation> & { id: number }

const mockDrizzle = dbFactory(mockedData, ETable.LOCATION)
describe('LocationService', () => {
	let service: LocationService
	beforeEach(async () => {
		// Getting instance from mock
		const module: TestingModule = await Test.createTestingModule({
			providers: [LocationService, { provide: DRIZZLE, useValue: mockDrizzle }],
		}).compile()

		service = module.get<LocationService>(LocationService)
	})

	describe('create', () => {
		it('ls-cr-1.1 should return the list of locations when the findAll function is called', async () => {
			const createLocation: CreateLocationDto = {
				namespace: 'test',
			}
			const expected = { ...mockedData, createdAt: 'today' }

			const result = await service.create(createLocation)
			expect(result).toEqual(expected)
		})
	})

	describe('findAll', () => {
		it('ls-fa-1.1 should return the list of locations when the findAll function is called', async () => {
			const expectedLocation = [mockedData]

			const result = await service.findAll()
			expect(result).toEqual(expectedLocation)
		})
	})
	describe('findOne', () => {
		it('ls-fo-1.1 should return the list of locations when the findAll function is called', async () => {
			const expectedLocation = mockedData

			const result = await service.findOne(expectedLocation.id)
			expect(result).toEqual(expectedLocation)
		})
	})
	describe('update', () => {
		it('ls-up-1.1 should return the list of locations when the findAll function is called', async () => {
			const updateLocation = { namespace: 'test' }
			const expectedLocation = { id: 1, namespace: updateLocation.namespace, updatedAt: 'today' }

			const result = await service.update(expectedLocation.id, updateLocation)
			expect(result).toEqual(expectedLocation)
		})
	})
	describe('remove', () => {
		it('ls-re-1.1 should return the list of locations when the findAll function is called', async () => {
			const expectedLocation = { ...mockedData, deletedAt: 'today' }

			const result = await service.remove(expectedLocation.id)
			expect(result).toEqual(expectedLocation)
		})
	})
})
