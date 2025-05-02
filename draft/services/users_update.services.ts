import { eq } from 'drizzle-orm'
import { usersTable } from '../../src/db/schema/users'
import { init } from '../_init'

const updateData = { tokenId: 'OTk2NjQ4NjItZWNiZC00Y2RhLWFmOWEtMThhYjcxZjNlYzkw' }

void init().then(async (db) => {
	try {
		const result = await db
			.update(usersTable)
			.set({ tokenID: updateData.tokenId })
			.where(eq(usersTable.id, 1))
			.returning({ id: usersTable.id })
		// eslint-disable-next-line no-console
		console.log(result)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		db['client'].end()
	} catch (err) {
		console.error(err)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		db['client'].end()
	}
})
