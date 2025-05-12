import { Inject, Injectable } from '@nestjs/common'
import { Namespace, Server } from 'socket.io'
import { DrizzleDB } from '../db/types/drizzle'
import { DRIZZLE } from '../db/db.module'
import { devicesTable } from '../db/schema'
import { DeviceService } from '../device/device.service'
import { eq } from 'drizzle-orm'
import { tryCatch } from '../common/functions/try_catch'
import { TDevice } from '../db/schema/devices'

export interface IRegisterResponse {
	serial: string
	version: string
}

@Injectable()
export class SocketService {
	private socket: Server
	@Inject(DRIZZLE) private db: DrizzleDB
	@Inject(DeviceService) private deviceService: DeviceService

	setServer(server: Server) {
		this.socket = server
	}

	emit(event: string, ...args: any[]) {
		this.socket.emit(event, ...args)
	}

	getNamespace(name: string): Namespace {
		if (!name.startsWith('/')) {
			name = '/' + name
		}
		return this.socket.of(name)
	}
	async createNamespaces() {
		const locations = await this.db.query.locationsTable.findMany({
			columns: {
				id: true,
				namespace: true,
			},
		})

		for (let i = 0; i < locations.length; i++) {
			const location = locations[i]
			const nsp = this.getNamespace(location.namespace)
			this.initNamespace(nsp, location)
		}
	}

	initNamespace(nsp: Namespace, location) {
		nsp.use((socket, next) => {
			next()
		})
		nsp.on('connection', (socket) => {
			socket.emit('register.ask')
			socket.on('register.response', async (data: IRegisterResponse) => {
				if (data && data.serial) {
					const update = { info: data, connected: true, socket_id: socket.id, idLocation: location.id }
					// eslint-disable-next-line prefer-const
					let [device, err] = await tryCatch(this.deviceService.findBySerial(data.serial))
					if (err) {
						device = (await this.db
							.insert(devicesTable)
							.values([
								{
									connected: true,
									serial: data.serial,
									socket_id: socket.id,
									idLocation: location.id,
									info: data,
								},
							])
							.returning({ id: devicesTable.id })) as unknown as TDevice
					} else if (device) {
						await this.db.update(devicesTable).set(update).where(eq(devicesTable.id, device.id))
					}
					socket.on('disconnect', async () => {
						if (device) {
							await this.db
								.update(devicesTable)
								.set({ connected: false, socket_id: null, last_connection: new Date() })
								.where(eq(devicesTable.id, device.id))
						}
					})
					socket.emit('register.ack')
				} else {
					socket.disconnect()
				}
			})
		})
	}
}
