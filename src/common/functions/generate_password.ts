import { generate, GenerateOptions } from 'generate-password'

export function generatePassword(options: GenerateOptions) {
	return generate(options)
}
