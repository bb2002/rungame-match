import * as SocketIO from "socket.io"
import {ConnectionPool} from "../types/pool"

export const onDisconnect = (socket: SocketIO.Socket) => {
    const pool: ConnectionPool = ConnectionPool.getInstance()

    for(let i = 0; i < pool.connectedPlayers.length; ++i) {
        if(socket.id == pool.connectedPlayers[i].connection.id) {
            pool.connectedPlayers.splice(i, 1)
            console.log("Disconnect >", socket.id)
        }
    }
}