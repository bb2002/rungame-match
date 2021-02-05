import * as socketIO from "socket.io"
import {onDisconnect} from "../private/Disconnect"
import {onMatchMaking} from "../private/MatchMaking"
import {onProfileInit} from "../private/ProfileInit"
import {onServerStatus} from "../private/ServerStatus"
import { ConnectionPool } from "./pool"

export class Player {
    connection: socketIO.Socket     // 소켓
    nickname: string = "GUEST"      // 플레이어 이름
    bestscore: number = 0           // 점수

    matchmaking: boolean = false    // 매치메이킹을 하고 있는가?

    constructor(connection: socketIO.Socket) {
        this.connection = connection
    }

    // Bind All events
    bindAll(): void {
        this.connection.on("profileinit", (data) => onProfileInit(this.connection, data))
        this.connection.on("matchmaking", (data) => { onMatchMaking(this.connection, data) })
        this.connection.on("serverstatus", () => { onServerStatus(this.connection) })
        this.connection.on("disconnect", () => { onDisconnect(this.connection) })
    }

    // Socket 을 기반으로 Player 를 찾습니다.
    static findPlayer(socket: SocketIO.Socket): Player {
        let pool = ConnectionPool.getInstance().connectedPlayers

        for(let p of pool) {
            if(p.connection.id == socket.id) {
                // find player
                return p
            }
        }

        return null
    }
}