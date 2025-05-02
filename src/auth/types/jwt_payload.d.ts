export interface IAuthJwtPayload {
	sub: number
	token_id: string
	email: string
	scope: ERole
	type: 'access' | 'refresh'
}
