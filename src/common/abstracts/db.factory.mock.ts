import { DrizzleDB } from '../../db/types/drizzle'

export const dbFactory = <T>(mockedData: Partial<T>, tableName: string) => {
	const mockDrizzle = {
		// Define the methods and their mock implementations here
		insert: jest.fn(() => ({
			values: jest.fn().mockImplementation(() => ({
				returning: jest.fn(() => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return { ...mockedData, createdAt: 'today' }
				}),
			})),
		})),
		query: {},

		update: jest.fn(() => ({
			set: jest.fn().mockImplementation((updatedData) => {
				if (updatedData.deletedAt) {
					updatedData.deletedAt = 'today'
				}
				return {
					where: jest.fn(() => ({
						returning: jest.fn(() => {
							if (updatedData.deletedAt) {
								return { ...mockedData, deletedAt: updatedData.deletedAt }
							}
							// eslint-disable-next-line @typescript-eslint/no-unsafe-return
							return { ...mockedData, ...updatedData, updatedAt: 'today' }
						}),
					})),
				}
			}),
		})),
	} as unknown as DrizzleDB

	mockDrizzle.query[tableName] = {
		findMany: jest.fn(() => {
			return [mockedData]
		}),
	}
	return mockDrizzle
}
