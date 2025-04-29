import { DrizzleConfig } from 'drizzle-orm/utils'
export interface IDBConfig {
	url: string
	drizzle: DrizzleConfig
}
export interface IServerConfig {
	port: number
}

export interface IPasswordConfig {
	MIN_LENGTH: number
	MIN_DIGIT: number
	MIN_UPPERCASE: number
}

export interface IHashConfig {
	salt: number
}
export interface IConfig {
	db: IDBConfig
	server: IServerConfig
	password: IPasswordConfig
	hash: IHashConfig
}

export default (schema) => {
	return () => {
		const configuration: IConfig = {
			db: {
				url: process.env.DB_URL as string,
				drizzle: {
					logger: true,

					schema: schema,
				},
			},
			server: {
				port: parseInt(process.env.API_PORT as string, 10) || 3100,
			},
			password: {
				MIN_LENGTH: 10,
				MIN_DIGIT: 2,
				MIN_UPPERCASE: 2,
			},
			hash: {
				salt: 10,
			},
		}
		return configuration
	}
}
