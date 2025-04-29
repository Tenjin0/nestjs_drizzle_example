import { z } from 'zod'

export const createUserSchema = z
	.object({
		name: z.string(),
		email: z.string(),
		idRole: z.number().int().positive(),
		password: z.string().optional(),
	})
	.required()

export type CreateUserDto = z.infer<typeof createUserSchema>
