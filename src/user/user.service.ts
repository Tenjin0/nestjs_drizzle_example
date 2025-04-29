import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DRIZZLE } from '../db/db.module'
import { DrizzleDB } from '../db/types/drizzle'
import { generate, GenerateOptions } from 'generate-password'
import { ConfigService } from '@nestjs/config'
import { IHashConfig, IPasswordConfig } from '../config'
import { hashPassword } from '../helpers/functions/hash_password'
import { users } from '../db/schema'

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
		console.log(this.configService.get<IHashConfig>('hash'), salt)
		createUserDto.password = await hashPassword(createUserDto.password, salt)
		return this.db.insert(users).values(createUserDto)
	}

	findAll() {
		return `This action returns all user`
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
