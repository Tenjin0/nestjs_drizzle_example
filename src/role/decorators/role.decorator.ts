import { SetMetadata } from '@nestjs/common'
import { ERole } from '../types/role.enum'

export const ROLES_KEY = 'roles'
export const RoleDecorator = (roles: [ERole, ...ERole[]]) => SetMetadata(ROLES_KEY, roles)
