import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from './auth.service'
import jwtConfig from '../config/jwt.config'
import { rawConfig } from '../config/raw.config'
import * as schema from '../../src/db/schema'
import refresh_jwtConfig from '../config/refresh_jwt.config'
import { IAuthJwtPayload } from './types/jwt_payload'

describe('AuthService', () => {
	let service: AuthService
	let jwtServiceMock: JwtService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
				{ provide: jwtConfig.KEY, useValue: rawConfig(schema).jwt },
				{ provide: refresh_jwtConfig.KEY, useValue: rawConfig(schema).refresh_jwt },
			],
		}).compile()

		service = module.get<AuthService>(AuthService)
		jwtServiceMock = module.get<JwtService>(JwtService)
	})

	it('as-1.1 should be defined', () => {
		expect(service).toBeDefined()
	})

	it('as-1.2 should return an access token', () => {
		const payload: IAuthJwtPayload = {
			sub: 1,
			email: 'test@test.com',
			scope: 'USER',
			token_id: 'token',
			type: 'access',
		}
		const expectedToken = 'token'

		const token = service.generateAccessToken(payload)
		expect(token).toEqual(expectedToken)
	})

	it('as-1.3 should return an refresh token', () => {
		const payload: IAuthJwtPayload = {
			sub: 1,
			email: 'test@test.com',
			scope: 'USER',
			token_id: 'token',
			type: 'access',
		}
		const expectedToken = 'token'

		const token = service.generateRefreshToken(payload)
		expect(token).toEqual(expectedToken)
	})
})
