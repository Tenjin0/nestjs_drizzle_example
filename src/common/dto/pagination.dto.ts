import { z } from 'zod'

export const paginationSchema = z.object({
	page: z.number().positive(),
	per_page: z.number().positive(),
})

export type PaginationDTO = z.infer<typeof paginationSchema>
