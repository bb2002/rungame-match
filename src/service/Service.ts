import {ConnectionPool, UE4ServerPool} from "../types/pool"
import {UE4Server} from "../types/ue4server"
import {ServerConfig} from "../conf/server"
import * as Shell from "child_process"

export const matchMakingService = () => {
    const pool: ConnectionPool = ConnectionPool.getInstance()
    const matchingPlayers = pool.connectedPlayers.filter((data) => data.matchmaking)

    // 플레이어 수 미달
    if(matchingPlayers.length < 2) {
        return
    }
    
    // 게임 세션 할당
    const ue4Pool: UE4ServerPool = UE4ServerPool.getInstance()
    let allocServer: UE4Server = null
    for(let i = 0; i < ue4Pool.ue4ServerPool.length; ++i) {
        if(ue4Pool.ue4ServerPool[i].available) {
            allocServer = ue4Pool.ue4ServerPool[i]
        }
    }

    // 할당 가능한 세션 없음
    if(allocServer == null) {
        return
    }

    // 가장 실력이 비슷한 사람과 매칭
    let _index = 1
    let _scoreSize = -1
    for(let i = 1; i < matchingPlayers.length; ++i) {
        if(_scoreSize == -1) {
            _scoreSize = Math.abs(matchingPlayers[0].bestscore - matchingPlayers[1].bestscore)
        } else {
            let absScore = Math.abs(matchingPlayers[0].bestscore - matchingPlayers[i].bestscore)
            if(_scoreSize > absScore) {
                _index = i
                _scoreSize = absScore
            }
        }
    }

    // 플레이어에게 새로운 서버 부여
    let player1 = matchingPlayers[0]
    let player2 = matchingPlayers[_index]
    player1.connection.emit("entry", { "host": ServerConfig.GAME_HOST + ":" + allocServer.broadcastPort, "other": player2.nickname, "otherbest": player2.bestscore})
    player2.connection.emit("entry", { "host": ServerConfig.GAME_HOST + ":" + allocServer.broadcastPort, "other": player1.nickname, "otherbest": player1.bestscore})
    
    console.log(`Matched > ${player1.nickname} & ${player2.nickname} in ${allocServer.broadcastPort}`)

    // 두 플레이어 pop
    player1.matchmaking = false
    player2.matchmaking = false
}

let i = ServerConfig.UE_SESSION_PORT
export const ue4sessionBootService = () => {
    if(i < ServerConfig.UE_SESSION_PORT + ServerConfig.MAX_UE_SESSION) {
        Shell.exec("./ue4/MyRunnerGame/Binaries/Linux/MyRunnerGameServer -PORT=" + i)
        console.log("[!] Booted >", i)
        ++i

        if(i == ServerConfig.UE_SESSION_PORT + ServerConfig.MAX_UE_SESSION) {
            console.log("[!] UE4 Session bootup OK.")
        }
    }
}