import { registerAs } from '@nestjs/config'
import { IPasswordConfig } from '.'
import { rawConfig } from './raw.config'

const passwordConfig: () => IPasswordConfig = () => ({
	...rawConfig().password,
})
export default registerAs<IPasswordConfig>('password', passwordConfig)
