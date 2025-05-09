import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { configService } from '../../../common/test/_init'
import { JwtAuthGuard } from './jwt-auth.guard'
import { IJWTConfig } from '../../../config'
import { JwtStrategy } from '../../strategies/jwt.strategy'
import { UserService } from '../../../user/user.service'
import { ISPUBLIC } from './jwt-auth.guard'
import { TokenExpiredError } from '@nestjs/jwt'
import { AuthController } from '../../auth.controller'
import { MockUserService } from '../../../user/user.service.mock'
// https://search.brave.com/search?q=nest+how+test+guard+jest+reflector&source=desktop&summary=1&conversation=b052d11857e92b0615657d

// const context = createMock({
// 	switchToHttp: () => ({
// 		getRequest: () => ({
// 			headers: {
// 				authorization: `Bearer ${tokenTest}`,
// 			},
// 			user: { role: 'user' },
// 		}),
// 	}),
// })

// TokenExpiredError: jwt expired
// expiredAt: 2025-05-08T18:08:14.000Z

jest.mock('jsonwebtoken', () => {
	const decoded = {
		id: 1,
		email: 'test@test.com',
		role: 'GUEST',
		type: 'access',
		token_id: 'ID',
	}
	return {
		verify: jest.fn((token, secretOrKey, options, callback) => {
			if (callback) {
				callback(null, decoded)
				return null
			}
			if (token === 'invalid-token') {
				throw new TokenExpiredError('jwt expired', new Date('2025-05-08T18:08:14.000Z'))
			}
			if (token === 'revoked-token') {
				return {
					...decoded,
					token_id: 'revoked',
				}
			}
			return decoded
		}),
	}
})

describe('JwtAuthGuardGuard', () => {
	let guard: JwtAuthGuard
	let reflector: Reflector
	let jwtConfig: IJWTConfig

	let jwtStragegy: JwtStrategy
	let userService: UserService
	beforeEach(() => {
		userService = MockUserService as unknown as UserService
		reflector = new Reflector()
		jwtConfig = configService.get('jwt')
		jwtStragegy = new JwtStrategy(jwtConfig, userService)
		guard = new JwtAuthGuard(reflector, jwtConfig, jwtStragegy)
	})

	it('Jwtg-1.1 should be defined', () => {
		expect(guard).toBeDefined()
	})

	it('Jwtg-1.2 should return true when ISPUBLIC is true', async () => {
		reflector.getAllAndOverride = jest.fn().mockReturnValue(true)
		const context = createMock<ExecutionContext>()
		const canActivate = await guard.canActivate(context)

		expect(canActivate).toBe(true)
	})

	it('Jwtg-1.3 should return true when ISPUBLIC is false and token is valid', async () => {
		reflector.getAllAndOverride = jest.fn().mockReturnValue(false)
		const context = createMock<ExecutionContext>()
		Reflect.set(context.getClass(), ISPUBLIC, false)

		// Mock the request object to have an invalid token
		const request = { headers: { authorization: 'Bearer valid-token' } }
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

		const canActivate = await guard.canActivate(context)

		expect(canActivate).toBe(true)
	})

	it('Jwtg-1.4 should return true when ISPUBLIC is false and tokenID has been revoked', async () => {
		reflector.getAllAndOverride = jest.fn().mockReturnValue(false)
		const context = createMock<ExecutionContext>()
		Reflect.set(context.getClass(), ISPUBLIC, false)

		// Mock the request object to have an invalid token
		const request = { headers: { authorization: 'Bearer revoked-token' } }
		context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })
		let catchedError: UnauthorizedException | null = null
		try {
			await guard.canActivate(context)
			expect(true).toBeFalsy() //should not go here
		} catch (err) {
			catchedError = err
		}
		expect(catchedError).toBeDefined()
		expect(catchedError).toBeInstanceOf(UnauthorizedException)
	})

	it('Jwtg-1.5 should ensure the JwtAuthGuard is applied to the user method', () => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const guards = Reflect.getMetadata('__guards__', AuthController.prototype.signOut)
		const guard = new guards[0]()
		expect(guard).toBeInstanceOf(JwtAuthGuard)
	})

	// it('should throw UnauthorizedException when token is invalid', () => {
	// 	reflector.getAllAndOverride = jest.fn().mockReturnValue(false)
	// 	const context = createMock<ExecutionContext>()
	// 	Reflect.set(context.getClass(), ISPUBLIC, false)

	// 	// Mock the request object to have an invalid token
	// 	const request = { headers: { authorization: 'Bearer invalid-token' } }
	// 	context.switchToHttp = jest.fn().mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) })

	// 	expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
	// })
})
