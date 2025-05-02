import { registerAs } from '@nestjs/config'
import { IJWTConfig } from '.'
import { rawConfig } from './raw.config'

const refreshJwtConfig: () => IJWTConfig = () => ({
	...rawConfig().refresh_jwt,
})
export default registerAs<IJWTConfig>('refresh_jwt', refreshJwtConfig)
