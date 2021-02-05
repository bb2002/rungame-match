import * as SocketIO from "socket.io"
import { Player } from "../types/user"

export const onMatchMaking = (socket: SocketIO.Socket, data) => {
    const player = Player.findPlayer(socket)
    const jsonData = JSON.parse(data)

    if(player != null) {
        if(jsonData.enable) player.matchmaking = true
        else            player.matchmaking = false

        console.log(`[!] MatchMaking ${player.connection.id} > ${player.matchmaking}`)
    }
}