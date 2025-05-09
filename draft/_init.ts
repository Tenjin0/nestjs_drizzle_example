import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from '../src/db/schema'
export { configService } from '../src/common/test/_init'

export type TInitFn = (db: NodePgDatabase<typeof schema>, Close: () => void) => Promise<any>
export const initDB = (callBackInit: TInitFn) => {
	const closeDBFactory = (db: NodePgDatabase<typeof schema>) => {
		return () => {
			db['client']['_end'] = true
			db['client']['end']()
		}
	}
	const client = new Client({
		connectionString: process.env.DB_URL,
		ssl: process.env.NODE_ENV === 'production',
	})
	const db = drizzle(client, { logger: true, schema: schema }) as NodePgDatabase<typeof schema>
	return client.connect().then(() => {
		client['_end'] = false
		db['client'] = client
		return callBackInit(db, closeDBFactory(db)).then(() => {
			console.log(client['_end'])
			if (!client['_end']) {
				client.end()
			}
		})
	})
}
