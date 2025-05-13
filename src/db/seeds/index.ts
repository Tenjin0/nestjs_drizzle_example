import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from '../schema'
import { rawConfig } from '../../../src/config/raw.config'
import { UserService } from '../../../src/user/user.service'
import { ConfigService } from '@nestjs/config'
import { TLocation } from '../schema/locations'
import { TDevice } from '../schema/devices'
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development'
}
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require('dotenv').config({
	path: ['.env', '.env.' + process.env.NODE_ENV, '.env.' + process.env.NODE_ENV + '.local'],
	override: true,
})
const configService = {
	get: (header) => {
		const config = rawConfig(schema)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config[header]
	},
}
async function reset(db, tableName: string) {
	await db.execute('TRUNCATE TABLE "' + tableName + '" RESTART IDENTITY CASCADE;')
}
async function seedusers(db) {
	await reset(db, 'users')
	const user = {
		name: 'Tenji',
		email: 'petitpatrice@gmail.com',
		password: process.env.PASSWORD ?? 'toto',
		idRole: 1,
	}

	const service = new UserService(configService as unknown as ConfigService, db)
	return service.create(user)
}
async function seedRoles(db) {
	await reset(db, 'roles')
	const roles = [
		{
			name: 'SUPERADMIN',
		},
		{
			name: 'ADMIN',
		},
		{
			name: 'USER',
		},
		{
			name: 'GUEST',
		},
	]
	await db.insert(schema.rolesTable).values(roles)
}

async function seedLocations(db) {
	await reset(db, 'locations')
	const locations: Partial<TLocation>[] = []
	for (let i = 1; i < 12; i++) {
		locations.push({
			namespace: `location_${i}`,
		})
	}
	await db.insert(schema.locationsTable).values(locations)
}

async function seedDevices(db) {
	await reset(db, 'devices')
	const devices: Partial<TDevice>[] = []
	for (let i = 1; i < 12; i++) {
		devices.push({
			serial: `fake_serial_${i}`,
			info: {
				serial: `fake_serial_${i}`,
				version: `1.0.${i}`,
			},
			idLocation: 1,
			connected: false,
			last_connection: new Date(),
		})
	}
	await db.insert(schema.devicesTable).values(devices)
}
const init = async () => {
	const client = new Client({
		connectionString: process.env.DB_URL,
		ssl: process.env.NODE_ENV === 'production',
	})
	const db = drizzle(client, { logger: true, schema: schema }) as NodePgDatabase<typeof schema>
	await client.connect()
	db['client'] = client
	return db
}

void init().then(async (db) => {
	try {
		await seedRoles(db)
		await seedusers(db)
		await seedLocations(db)
		await seedDevices(db)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		db['client'].end()
	} catch (err) {
		console.error(err)
		db['client'].end()
	}
})
