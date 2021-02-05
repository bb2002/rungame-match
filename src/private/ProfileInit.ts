import * as SocketIO from "socket.io"
import { Player } from "../types/user"

export const onProfileInit = (socket: SocketIO.Socket, data) => {
    const player = Player.findPlayer(socket)
    const jsonData = JSON.parse(data)

    if(data) {
        const nickname: string = jsonData.nickname
        const bestscore: number = jsonData.bestscore

        if(nickname != undefined && bestscore != undefined) {
            player.nickname = nickname.length == 0 ? "GUEST" : nickname
            player.bestscore = bestscore
            console.log(`[!] ProfileInit ${player.connection.id} > name:${nickname}, score:${bestscore}`)
        }
    }    
}