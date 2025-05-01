import { registerAs } from '@nestjs/config'
import { IHashConfig } from '.'
import { rawConfig } from './raw.config'

const hash: () => IHashConfig = () => ({
	...rawConfig().hash,
})
export default registerAs('hash', hash)
