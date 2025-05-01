import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { DrizzleConfig } from 'drizzle-orm/utils'

import { IDBConfig } from '../config'

export const DRIZZLE = Symbol('drizzle-connection')
@Module({
	providers: [
		{
			provide: DRIZZLE,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const dbConfig = configService.get<IDBConfig>('db')
				console.log('dbConfig', dbConfig)
				const pool = new Pool({
					connectionString: dbConfig?.url,
					ssl: dbConfig?.ssl,
				})
				const drizzleConfig = configService.get('drizzle') as DrizzleConfig
				console.log('drizzle', drizzleConfig)
				return drizzle(pool, { ...drizzleConfig })
			},
		},
	],
	exports: [DRIZZLE],
})
export class DbModule {}
