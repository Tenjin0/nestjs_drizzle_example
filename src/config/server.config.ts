import { registerAs } from '@nestjs/config'
import { IServerConfig } from '.'
import { rawConfig } from './raw.config'

const server: () => IServerConfig = () => ({
	...rawConfig().server,
})
export default registerAs('server', server)
