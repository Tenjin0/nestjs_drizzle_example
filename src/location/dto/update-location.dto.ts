import { z } from 'zod'
import { createLocationSchema } from './create-location.dto'

export const updateLocationSchema = createLocationSchema

export type UpdateLocationDto = z.infer<typeof updateLocationSchema>
