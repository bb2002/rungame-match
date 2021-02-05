import {Player} from "./user"
import { UE4Server } from "./ue4server"

export class ConnectionPool {
    private static instance?: ConnectionPool = null

    connectedPlayers: Player[]      // Socket.IO 에 연결된 접속자

    constructor() {
        console.log("[!] ConnectionPool generated.")
        this.connectedPlayers = []
    }

    static getInstance(): ConnectionPool {
        if(ConnectionPool.instance == null) 
        {
            ConnectionPool.instance = new ConnectionPool()
        } 

        return ConnectionPool.instance
    }
}

export class UE4ServerPool {
    private static instance?: UE4ServerPool = null

    ue4ServerPool: UE4Server[]      // Socket.IO 에 연결된 접속자

    constructor() {
        console.log("[!] UE4ServerPool generated.")
        this.ue4ServerPool = []
    }

    static getInstance(): UE4ServerPool {
        if(UE4ServerPool.instance == null) 
        {
            UE4ServerPool.instance = new UE4ServerPool()
        } 

        return UE4ServerPool.instance
    }
}