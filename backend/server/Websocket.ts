import type http from "http";
import SocketIO from "socket.io";

class WSS {
    public static io: SocketIO.Server;

    public static init(server: http.Server) {
        WSS.io = new SocketIO.Server(server);
    }
}

export default WSS;
