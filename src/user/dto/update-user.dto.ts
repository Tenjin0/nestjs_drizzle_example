import { z } from 'zod'
import { createUserSchema } from './create-user.dto'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUserSchema = createUserSchema
	.extend({
		tokenID: z.string(),
	})
	.partial({
		name: true,
		idRole: true,
		tokenID: true,
		email: true,
		password: true,
	})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
