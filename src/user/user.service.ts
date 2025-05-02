import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DRIZZLE } from '../db/db.module'
import { DrizzleDB } from '../db/types/drizzle'
import { generate, GenerateOptions } from 'generate-password'
import { ConfigService } from '@nestjs/config'
import { IHashConfig, IPasswordConfig } from '../config'
import { hashPassword } from '../common/functions/hash_password'
import { usersTable } from '../db/schema'
@Injectable()
export class UserService {
	constructor(
		@Inject(ConfigService) private configService: ConfigService,
		@Inject(DRIZZLE) private db: DrizzleDB,
	) {}

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
		return this.db.insert(usersTable).values(createUserDto)
	}

	findByEmail(email: string) {
		return this.db.query.usersTable
			.findMany({
				columns: {
					id: true,
					email: true,
					deletedAt: true,
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
				where: eq(usersTable.email, email),
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

	findAll() {
		return this.db.query.usersTable.findMany()
	}

	async findOne(id: number) {
		return this.db.query.usersTable
			.findMany({
				limit: 1,
				columns: {
					id: true,
					email: true,
					tokenID: true,
					deletedAt: true,
				},
				where: eq(usersTable.id, id),
				with: {
					role: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			})
			.then((users) => {
				if (users.length === 0) {
					return null
				}
				if (users.length > 0) {
					return users[0]
				}
			})
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		if (updateUserDto.password) {
			updateUserDto.password = await this.hashingPassword(updateUserDto.password)
		}
		return this.db
			.update(usersTable)
			.set(updateUserDto)
			.where(eq(usersTable.id, id))
			.returning({ id: usersTable.id, updated_at: usersTable.updatedAt })
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}
}
