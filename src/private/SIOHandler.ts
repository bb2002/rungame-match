export default interface SocketIOEventHandler {
    socket: SocketIO.Socket
    bindAll(): SocketIOEventHandler
}