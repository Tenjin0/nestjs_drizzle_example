import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { DrizzleConfig } from 'drizzle-orm/utils'

import { IDBConfig } from '../config'

export const DRIZZLE = 'drizzle-connection'

export const DrizzleProvider = {
	provide: DRIZZLE,
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const dbConfig = configService.get<IDBConfig>('db')
		const pool = new Pool({
			connectionString: dbConfig?.url,
			ssl: dbConfig?.ssl,
		})
		const drizzleConfig = configService.get('drizzle') as DrizzleConfig
		return drizzle(pool, { ...drizzleConfig })
	},
}
@Module({
	providers: [DrizzleProvider],
	exports: [DrizzleProvider],
})
export class DbModule {}
