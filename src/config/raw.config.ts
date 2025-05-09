import { readFileSync } from 'fs'

import { IConfig } from '.'
import { InternalServerErrorException } from '@nestjs/common'

let PUBLIC_KEY: Buffer
let PRIVATE_KEY: Buffer
let REFRESH_PUBLIC_KEY: Buffer
let REFRESH_PRIVATE_KEY: Buffer
try {
	PUBLIC_KEY = readFileSync('certs/public_key.pem')
	PRIVATE_KEY = readFileSync('certs/private_key.pem')

	REFRESH_PUBLIC_KEY = readFileSync('certs/refresh_public_key.pem')
	REFRESH_PRIVATE_KEY = readFileSync('certs/refresh_private_key.pem')
} catch (err) {
	console.error('If you have no .certs folders please execute generate_key.sh')
	const error = new InternalServerErrorException('Unable to get cert keys')
	error['more'] = err
	throw error
}
// separate so i can use it in draft or seed folders standalone script

export const rawConfig = (schema?: any) => {
	const configuration: IConfig = {
		db: {
			url: process.env.DB_URL as string,
			ssl: process.env.NODE_ENV === 'production',
		},
		drizzle: {
			logger: true,
			schema: schema,
		},
		server: {
			port: parseInt(process.env.API_PORT as string, 10) || 3100,
		},
		password: {
			MIN_LENGTH: 10,
			MIN_DIGIT: 2,
			MIN_UPPERCASE: 2,
			PREFIX: process.env.PREFIX_PASSWORD ?? '',
		},
		hash: {
			salt: 10,
		},
		jwt: {
			PUBLIC_KEY: PUBLIC_KEY.toString(),
			PRIVATE_KEY: PRIVATE_KEY.toString(),
			algorithm: 'RS256',
			expire_in: process.env.JWT_EXPIRE_IN ?? '1h',
		},
		refresh_jwt: {
			PUBLIC_KEY: REFRESH_PUBLIC_KEY.toString(),
			PRIVATE_KEY: REFRESH_PRIVATE_KEY.toString(),
			algorithm: 'RS256',
			expire_in: process.env.JWT_EXPIRE_IN ?? '3d',
		},
	}
	return configuration
}
