export const ServerConfig = {
    PORT: 31122,            // SocketIO 가 사용 할 포트
    UE_PORT: 31123,         // UE4 - 세션간 소켓
    MAX_CONNECTION: 150,    // SocketIO 서버에 접속 가능한 수
    MAX_UE_SESSION: 6,      // 최대 UE4 세션 수
    UE_SESSION_PORT: 31200, // UE4 세션이 사용할 포트 N ~ N + MAX_UE_SESSION - 1
    GAME_HOST: "rungame.saintdev.kr",   // 게임 서버 호스트
    GAME_ENGINE_PATH: "./ue4/MyRunnerGame/Binaries/Linux/MyRunnerGameServer"
}
