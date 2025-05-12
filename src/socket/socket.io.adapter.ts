import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions } from 'socket.io'

export class SocketIOAdapter extends IoAdapter {
	constructor(app: INestApplicationContext) {
		super(app)
	}

	createIOServer(port: number, options?: any) {
		const cors = {}
		const optionsWithCors: ServerOptions = {
			transports: ['websocket'],
			...options,
			cors,
		}

		const server: Server = super.createIOServer(port, optionsWithCors)
		// eslint-disable-next-line @typescript-eslint/unbound-method
		server.use(this.middleware)

		return server
	}

	middleware() {
		return (socket: any, next) => {
			next()
		}
	}
}
