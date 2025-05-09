import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UsePipes } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, createUserSchema } from './dto/create-user.dto'
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto'
import { ERole } from '../role/types/role.enum'
import { RoleDecorator } from '../role/decorators/role.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard'
import { RolesGuard } from '../role/guards/role.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ZodValidationPipe } from '../common/pipes/zod_validation.pipe'

@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard) // needed to be executed before rolesguard
@RoleDecorator([ERole.SUPERADMIN, ERole.ADMIN])
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ZodValidationPipe(createUserSchema))
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Get()
	findAll() {
		return this.userService.findAll()
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.userService.findOne(id)
	}

	@UsePipes(new ZodValidationPipe(updateUserSchema))
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id)
	}
}
