import { registerAs } from '@nestjs/config'
import { DrizzleConfig } from 'drizzle-orm'

import * as schema from '../db/schema'
import { rawConfig } from './raw.config'

const drizzleConfig: () => DrizzleConfig = () => ({
	...rawConfig(schema).drizzle,
})
export default registerAs<DrizzleConfig>('drizzle', drizzleConfig)
