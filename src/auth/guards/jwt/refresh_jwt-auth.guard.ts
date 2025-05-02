import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
export const ISPUBLIC = 'IS_PUBLIC'
@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh_jwt') {}
