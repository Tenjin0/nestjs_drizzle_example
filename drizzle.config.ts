// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
require('dotenv').config({
	path: ['.env', '.env.' + process.env.NODE_ENV, '.env.' + process.env.NODE_ENV + '.local'],
	override: true,
})

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './src/db/migrations',
	schema: './src/db/schema',
	dialect: 'postgresql',
	verbose: true,
	dbCredentials: {
		url: process.env['DB_URL']!,
	},
	migrations: {
		table: 'migrations',
		schema: 'public',
	},
})
