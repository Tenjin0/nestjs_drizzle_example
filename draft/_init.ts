import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from '../src/db/schema'
import { rawConfig } from '../src/config/raw.config'

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development'
}
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require('dotenv').config({
	path: ['.env', '.env.' + process.env.NODE_ENV, '.env.' + process.env.NODE_ENV + '.local'],
	override: true,
})

export const init = async () => {
	const client = new Client({
		connectionString: process.env.DB_URL,
		ssl: process.env.NODE_ENV === 'production',
	})
	const db = drizzle(client, { logger: true, schema: schema }) as NodePgDatabase<typeof schema>
	await client.connect()
	db['client'] = client
	return db
}

export const configService = {
	get: (header) => {
		const config = rawConfig(schema)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config[header]
	},
}
