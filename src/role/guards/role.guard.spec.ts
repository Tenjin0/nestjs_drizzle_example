import { Reflector } from '@nestjs/core'
import { ERole } from '../types/role.enum'
import { RolesGuard } from './role.guard'
import { UserController } from '../../user/user.controller'
import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext } from '@nestjs/common'
import { ROLES_KEY } from '../decorators/role.decorator'

describe('RolesGuard', () => {
	let guard: RolesGuard
	let reflector: Reflector

	beforeEach(() => {
		reflector = new Reflector()
		guard = new RolesGuard(reflector)
	})

	it('RG-1.1 should be defined', () => {
		expect(new Reflector()).toBeDefined()
	})

	it('RG-1.2 should return false if user not SUPERADMIN or ADMIN', async () => {
		reflector.getAllAndOverride = jest.fn().mockReturnValue([ERole.SUPERADMIN, ERole.ADMIN])
		const context = createMock<ExecutionContext>()
		Reflect.set(context.getClass(), ROLES_KEY, [ERole.SUPERADMIN, ERole.ADMIN])

		// Mock the request object to have an invalid token
		const request = { user: { role: ERole.USER } }
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		const canActivate = await guard.canActivate(context)

		expect(canActivate).toBe(false)
	})

	it('RG-1.3 should return true with no roles needed', async () => {
		reflector.getAllAndOverride = jest.fn().mockReturnValue(null)
		const context = createMock<ExecutionContext>()
		// Reflect.set(context.getClass(), ROLES_KEY, [ERole.SUPERADMIN, ERole.ADMIN])

		// Mock the request object to have an invalid token
		const request = { user: { role: ERole.USER } }
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		const canActivate = await guard.canActivate(context)

		expect(canActivate).toBe(true)
	})

	it('RG-1.4 should return true if user is ADMIN', async () => {
		reflector.getAllAndOverride = jest.fn().mockReturnValue([ERole.SUPERADMIN, ERole.ADMIN])
		const context = createMock<ExecutionContext>()
		// Reflect.set(context.getClass(), ROLES_KEY, [ERole.SUPERADMIN, ERole.ADMIN])

		// Mock the request object to have an invalid token
		const request = { user: { scope: ERole.ADMIN } }
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		const canActivate = await guard.canActivate(context)

		expect(canActivate).toBe(true)
	})
	it('RG-2.1 should ensure the JwtAuthGuard is applied to the user method', () => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const guards = Reflect.getMetadata('__guards__', UserController)
		expect(guards.length).toBeGreaterThan(0)
		const guard = new guards[1]()
		expect(guard).toBeInstanceOf(RolesGuard)
	})
})
