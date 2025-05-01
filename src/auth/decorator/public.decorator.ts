import { SetMetadata } from '@nestjs/common'
import { ISPUBLIC } from '../guards/jwt/jwt-auth.guard'

export const PublicDecorator = () => SetMetadata(ISPUBLIC, true)
