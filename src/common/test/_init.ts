import { rawConfig } from '../../../src/config/raw.config'
import * as schema from '../../../src/db/schema'

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development'
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({
	path: ['.env', '.env.' + process.env.NODE_ENV, '.env.' + process.env.NODE_ENV + '.local'],
	override: true,
})

export const configService = {
	get: (header) => {
		const config = rawConfig(schema)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config[header]
	},
}
