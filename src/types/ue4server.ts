import * as SocketIO from "socket.io"

export class UE4Server {
    socket: SocketIO.Socket
    broadcastPort: number   // 브로드케스팅 포트
    available: boolean      // 서버 이용 가능 여부

    constructor(socket: SocketIO.Socket) {
        this.socket = socket
    }
}