import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string, saltLength: number): Promise<string> {
	const salt = await bcrypt.genSalt(saltLength)

	const hash: string = await bcrypt.hash(password, salt)
	return hash
}
