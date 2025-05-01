import { DrizzleConfig } from 'drizzle-orm/utils'
import { Algorithm } from 'jsonwebtoken'
// import { rawConfig } from './raw.config'
export interface IDBConfig {
	url: string
	ssl: boolean
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

export interface IJWTConfig {
	PUBLIC_KEY: string
	PRIVATE_KEY: string
	algorithm: Algorithm[]
	expire_in: string
}
export interface IConfig {
	db: IDBConfig
	drizzle: DrizzleConfig
	server: IServerConfig
	password: IPasswordConfig
	hash: IHashConfig
	jwt: IJWTConfig
}

// export default (schema) => {
// 	return () => {
// 		return rawConfig(schema)
// 	}
// }
