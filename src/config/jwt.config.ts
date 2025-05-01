import { registerAs } from '@nestjs/config'
import { IJWTConfig } from '.'
import { rawConfig } from './raw.config'

const jwt: () => IJWTConfig = () => ({
	...rawConfig().jwt,
})
export default registerAs<IJWTConfig>('jwt', jwt)
