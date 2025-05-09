import { z } from 'zod'
import { createUserSchema } from './create-user.dto'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateUserSchema = createUserSchema
	.extend({
		tokenID: z.string().nullable(),
	})
	.partial({
		name: true,
		idRole: true,
		tokenID: true,
		email: true,
		password: true,
	})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
