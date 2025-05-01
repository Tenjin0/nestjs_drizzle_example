import { registerAs } from '@nestjs/config'
import { IPasswordConfig } from '.'
import { rawConfig } from './raw.config'

const password: () => IPasswordConfig = () => ({
	...rawConfig().password,
})
export default registerAs<IPasswordConfig>('password', password)
