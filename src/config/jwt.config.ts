import { registerAs } from '@nestjs/config'
import { IJWTConfig } from '.'
import { rawConfig } from './raw.config'

const jwtConfig: () => IJWTConfig = () => ({
	...rawConfig().jwt,
})
export default registerAs<IJWTConfig>('jwt', jwtConfig)
