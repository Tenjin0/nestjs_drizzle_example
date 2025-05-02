import { registerAs } from '@nestjs/config'
import { IDBConfig } from '.'
import { rawConfig } from './raw.config'

const dbConfig: () => IDBConfig = () => ({
	...rawConfig().db,
})
export default registerAs<IDBConfig>('db', dbConfig)
