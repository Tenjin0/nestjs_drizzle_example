import * as schema from '../src/db/schema'
import { UserService } from '../src/user/user.service'
import { ConfigService } from '@nestjs/config'
import { configService } from './_init'

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
// require('dotenv').config({
// 	path: ['.env', '.env.' + process.env.NODE_ENV, '.env.' + process.env.NODE_ENV + '.local'],
// 	override: true,
// })

async function reset(db, tableName: string) {
	await db.execute('TRUNCATE TABLE "' + tableName + '" RESTART IDENTITY CASCADE;')
}
async function seedusers(db) {
	await reset(db, 'users')
	const user = {
		name: 'Tenji',
		email: 'petitpatrice@gmail.com',
		password: process.env.password ?? 'toto',
		idRole: 1,
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

// void init().then(async (db) => {
// 	try {
// 		await seedRoles(db)
// 		await seedusers(db)

// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
// 		db['client'].end()
// 	} catch (err) {
// 		console.error(err)
// 		db['client'].end()
// 	}
// })
