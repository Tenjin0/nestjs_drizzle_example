import { registerAs } from '@nestjs/config'
import { IDBConfig } from '.'
import { rawConfig } from './raw.config'

const db: () => IDBConfig = () => ({
	...rawConfig().db,
})
export default registerAs<IDBConfig>('db', db)
