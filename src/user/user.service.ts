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
		@Inject(DRIZZLE) private db: DrizzleDB,
		@Inject(ConfigService) private configService: ConfigService,
	) {}

	async create(createUserDto: CreateUserDto) {
		if (!createUserDto.password) {
			const passwordOption = this.configService.get<IPasswordConfig>('password') as GenerateOptions
			const password: string = generate(passwordOption)
			createUserDto.password = password
		}
		const salt: number = this.configService.get<IHashConfig>('hash')?.salt as number
		createUserDto.password = await hashPassword(createUserDto.password, salt)
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

	findOne(id: number) {
		return `This action returns a #${id} user`
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}
}
