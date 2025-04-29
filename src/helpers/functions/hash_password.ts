import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string, saltLength: number): Promise<string> {
	const salt = await bcrypt.genSalt(saltLength)
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	const hash: string = await bcrypt.hash(password, salt)
	return hash
}
