import { ERole } from '../types/role.enum'
import { RolesGuard } from './role.guard'

describe('DecoratorsGuard', () => {
	it('should be defined', () => {
		expect(new RolesGuard()).toBeDefined()
	})
})
