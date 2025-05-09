import { BasicAuthGuard } from './basic-auth.guard'
import { createMock } from '@golevelup/ts-jest'
import { BadRequestException, ExecutionContext } from '@nestjs/common'
import { AuthController } from '../../auth.controller'
describe('BasicAuthGuard', () => {
	let guard: BasicAuthGuard

	beforeEach(() => {
		guard = new BasicAuthGuard()
	})

	it('BAG-1.1 should be defined', () => {
		expect(new BasicAuthGuard()).toBeDefined()
	})

	it('BAG-1.2 should return true when creditentials is valid', () => {
		const fakeUser = {
			email: 'test@test.com',
			password: 'password',
		}
		const encodedString = Buffer.from(`${fakeUser.email}:${fakeUser.password}`).toString('base64')
		const request = { headers: { authorization: `Basic ${encodedString}` }, body: null }

		const context = createMock<ExecutionContext>()
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		const canActivate = guard.canActivate(context)
		expect(canActivate).toBe(true)
		expect(request.body).toEqual(fakeUser)
	})

	it('BAG-1.3 should return false without header', () => {
		const request = { headers: { authorization: null }, body: null }

		const context = createMock<ExecutionContext>()
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		expect(() => guard.canActivate(context)).toThrow(BadRequestException)
	})
	it('BAG-1.4 should return false with incorrect header', () => {
		const fakeUser = {
			email: 'test@test.com',
			password: 'password',
		}
		const encodedString = Buffer.from(`${fakeUser.email}:${fakeUser.password}`).toString('base64')
		const request = { headers: { authorization: `TOTO ${encodedString}` }, body: null }

		const context = createMock<ExecutionContext>()
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		expect(() => guard.canActivate(context)).toThrow(BadRequestException)
	})

	it('BAG-1.5 should return false with incorrect header', () => {
		const request = { headers: { authorization: `Basic toto` }, body: null }

		const context = createMock<ExecutionContext>()
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		expect(() => guard.canActivate(context)).toThrow(BadRequestException)
	})

	it('BAG-2.1 should ensure the BasicAuthGuard is applied to the user method', () => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const guards = Reflect.getMetadata('__guards__', AuthController.prototype.signIn)
		expect(guards.length).toBeGreaterThan(0)
		const guard = new guards[0]()
		expect(guard).toBeInstanceOf(BasicAuthGuard)
	})

})
