import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { and, eq, isNull } from 'drizzle-orm'
import { compare } from 'bcrypt'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DRIZZLE } from '../db/db.module'
import { DrizzleDB } from '../db/types/drizzle'
import { generate, GenerateOptions } from 'generate-password'
import { ConfigService } from '@nestjs/config'
import { IHashConfig, IPasswordConfig } from '../config'
import { hashPassword } from '../common/functions/hash_password'
import { usersTable } from '../db/schema'
import { NDEServiceDB } from '../common/abstracts/servicesDB.class'
import { ETable } from '../common/enums/table.enum'
import { TUser } from '../db/schema/users'

@Injectable()
export class UserService extends NDEServiceDB<TUser, CreateUserDto, UpdateUserDto> {
	excludedFields: string[] = ['password', 'tokenID']
	constructor(
		@Inject(ConfigService) private configService: ConfigService,
		@Inject(DRIZZLE) protected db: DrizzleDB,
	) {
		super(db, usersTable, ETable.USER)
	}

	hashingPassword(password) {
		const salt: number = this.configService.get<IHashConfig>('hash')?.salt as number
		const passwordPrefix = this.configService.get<IPasswordConfig>('password')?.PREFIX ?? ''
		return hashPassword(password, salt, passwordPrefix)
	}

	async create(createUserDto: CreateUserDto) {
		const passwordOption = this.configService.get<IPasswordConfig>('password') as IPasswordConfig
		if (!createUserDto.password) {
			const password: string = generate({
				...(passwordOption as GenerateOptions),
			})
			createUserDto.password = password
		}
		createUserDto.password = await this.hashingPassword(createUserDto.password)
		return super.create(createUserDto)
	}

	findByEmail(email: string) {
		// console.log(getTableColumns(usersTable))
		return this.db.query.usersTable
			.findMany({
				columns: {
					id: true,
					email: true,
					deletedAt: false,
					password: true,
				},
				with: {
					role: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
				limit: 1,
				where: and(eq(usersTable.email, email), isNull(usersTable.deletedAt)),
			})
			.then((users) => {
				if (users.length === 0) {
					return null
				}
				if (users.length > 0) {
					return users[0]
				}
			})
		// return this.db.select().from(users).where(eq(users.email, email))
	}

	async validateUser(email: string, password: string, prefix?: string) {
		const user = await this.findByEmail(email)
		if (!user) throw new UnauthorizedException('User not found')
		const isPasswordMatch = await compare(prefix + password, user.password)
		if (!isPasswordMatch) throw new UnauthorizedException('Invalid Creditentials')

		return { ...user, password: undefined } //satisfies Partial<TUser>
	}
}
