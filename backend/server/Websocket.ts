import type http from "http";
import SocketIO from "socket.io";
import type { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

class WSS {
    public static io: Server;

    public static init(server: http.Server) {
        WSS.io = new SocketIO.Server(server, {
            cors: {
                origin: process.env.NODE_ENV === "production" ? undefined : "http://localhost:5173"
            }
        });
    }

    static async updateClassement(socket?: Socket) {
        const classement = await client.account.findMany({
            select: {
                devinciEmail: true,
                placedPixels: true
            },
            orderBy: {
                placedPixels: "desc"
            }
        });
        if(!socket) this.io.emit("classementUpdate", classement);
        else socket.emit("classementUpdate", classement);
    }
}

export default WSS;
