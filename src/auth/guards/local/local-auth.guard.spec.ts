import { LocalAuthGuard } from './local-auth.guard'
import { Reflector } from '@nestjs/core'
import { AuthController } from '../../auth.controller'

describe('LocalAuthGuard', () => {
	let guard: LocalAuthGuard
	let reflector: Reflector

	beforeEach(() => {
		reflector = new Reflector()
		guard = new LocalAuthGuard(reflector)
	})

	it('LAG-1.1 should be defined', () => {
		expect(guard).toBeDefined()
	})

	it('LAG-1.2 should ensure the JwtAuthGuard is applied to the user method', () => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const guards = Reflect.getMetadata('__guards__', AuthController.prototype.login)
		expect(guards.length).toBeGreaterThan(0)
		const guard = new guards[0]()
		expect(guard).toBeInstanceOf(LocalAuthGuard)
	})
})
