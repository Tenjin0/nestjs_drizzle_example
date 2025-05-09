import { ERole } from '../role/types/role.enum'

const userTest = {
	id: 1,
	email: 'test@test.com',
	tokenID: 'ID',
	role: {
		name: ERole.GUEST,
	},
}
export const MockUserService = {
	create: jest.fn().mockReturnValue(userTest),
	findByEmail: jest.fn().mockReturnValue(userTest),
	findAll: jest.fn().mockReturnValue([]),
	findOne: jest.fn().mockReturnValue(userTest),
	update: jest.fn().mockReturnValue(userTest),
	remove: jest.fn().mockReturnValue(userTest),
}
