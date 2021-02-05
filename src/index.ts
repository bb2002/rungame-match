import * as SocketIO from "socket.io"
import {Player} from "./types/user"
import {ServerConfig} from "./conf/server"
import {ConnectionPool, UE4ServerPool} from "./types/pool"
import {matchMakingService, ue4sessionBootService} from "./service/Service"
import { UE4Server } from "./types/ue4server"


const server: SocketIO.Server = SocketIO.listen(ServerConfig.PORT)
server.on("connection", onConnected)

function onConnected(socket: SocketIO.Socket) {
    const pool: ConnectionPool = ConnectionPool.getInstance()

    if(pool.connectedPlayers.length > ServerConfig.MAX_CONNECTION) {
        // if, server is full
        socket.emit("deny", "Server is full.")
        socket.disconnect()

        console.log("Player Deny > Server is full")
    } else {
        // Add Player
        const tmp: Player = new Player(socket)
        pool.connectedPlayers.push(tmp)
        tmp.bindAll()

        console.log("Player Entry >", socket.id)
    }
}

const ue4Server: SocketIO.Server = SocketIO.listen(ServerConfig.UE_PORT)
ue4Server.on("connection", onUE4Connected)

function onUE4Connected(socket: SocketIO.Socket) {
    console.log("UE4Session Entry >", socket.id)

    socket.on("serverinit", (data) => {
        // Event ServerInit
        const jsonData = JSON.parse(data)
        const pool: UE4ServerPool = UE4ServerPool.getInstance()

        const tmp: UE4Server = new UE4Server(socket)
        tmp.broadcastPort = jsonData.broadcastPort
        tmp.available = jsonData.available

        pool.ue4ServerPool.push(tmp)
        console.log(`serverinit > port:${tmp.broadcastPort}, available: ${tmp.available}`)
    })

    socket.on("disconnect", () => {
        const pool: UE4ServerPool = UE4ServerPool.getInstance()
        pool.ue4ServerPool = pool.ue4ServerPool.filter((value: UE4Server) => {
            if(socket.id == value.socket.id) {
                console.log("UE4Session Exit >", socket.id)
                return false
            } else {
                return true
            }
        })
    })
}

console.log(`MyRunnerServer - MatchMaking 기동, 포트: ${ServerConfig.PORT}`)
console.log("=-=-=-=-=-= 설정 정보 =-=-=-=-=")
console.log("- MAX PLAYER:", ServerConfig.MAX_CONNECTION)
console.log("- MAX UE4 SESSION:", ServerConfig.MAX_UE_SESSION)
console.log(`- UE4 PORT: ${ServerConfig.UE_SESSION_PORT} - ${ServerConfig.UE_SESSION_PORT + ServerConfig.MAX_UE_SESSION - 1}`)

// Start MatchMakingService
setInterval(matchMakingService, 1000)

// 3초에 한번 서비스 부팅
console.log("[!] UE4 Session booting...")
setInterval(ue4sessionBootService, 1000)
