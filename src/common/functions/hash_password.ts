import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string, saltLength: number, prefix?: string): Promise<string> {
	const salt = await bcrypt.genSalt(saltLength)

	const hash: string = await bcrypt.hash(prefix + password, salt)
	return hash
}
