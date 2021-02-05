import * as SocketIO from "socket.io"
import { ConnectionPool } from "../types/pool"
import { ServerConfig } from "../conf/server"
import { Player } from "../types/user"

export const onServerStatus = (socket: SocketIO.Socket) => {
    const connPlayer: Player[] = ConnectionPool.getInstance().connectedPlayers
    const loadSize: number = connPlayer.length / ServerConfig.MAX_CONNECTION * 100
    
    let response = {
        loadsize: 0         // 1 = 쾌적, 2 = 혼잡, 3 = 과부하
    }

    if(loadSize > 80) {
        // 80% 이상 = 과부하
        response.loadsize = 3
    } else if(loadSize > 40 && loadSize < 80) {
        // 40~80% = 혼잡
        response.loadsize = 2
    } else {
        // 40 이하 = 쾌적
        response.loadsize = 1
    }

    socket.emit("serverstatus", response)
    console.log("ServerStatus >", response)
}