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
				const dbURL = configService.get<IDBConfig>('db')?.url
				const pool = new Pool({
					connectionString: dbURL,
					ssl: true,
				})
				const drizzleConfig = configService.get<IDBConfig>('db')?.drizzle as DrizzleConfig
				return drizzle(pool, { ...drizzleConfig })
			},
		},
	],
	exports: [DRIZZLE],
})
export class DbModule {}
