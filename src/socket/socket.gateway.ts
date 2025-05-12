import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { SocketService } from './socket.service'

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class SocketGateway implements OnGatewayInit {
	constructor(private readonly socketService: SocketService) {}
	afterInit(server: Server) {
		this.socketService.setServer(server)
	}
	@WebSocketServer() server: Server

	handleConnection(client: Socket, ...args: any[]) {
		console.log('client', args, 'HERE')
	}
}
