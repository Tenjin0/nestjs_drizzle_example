export interface IAuthJwtPayload {
	sub: number
	token_id: string
	email: string
	scope: string
	type: 'access' | 'refresh'
}
