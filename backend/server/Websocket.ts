import type http from "http";
import SocketIO from "socket.io";
import type { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

class WSS {
    public static io: Server;
    private static _startTime = Date.now();

    public static init(server: http.Server) {
        WSS.io = new SocketIO.Server(server, {
            cors: {
                origin: process.env.NODE_ENV === "production" ? undefined : "http://localhost:5173",
            },
        });
    }

    /**
     * Sends an 'updateClassement' event to one socket if provided. \
     * If no socket is provided, broadcast the event to all connected clients.
     * @param socket
     */
    static async updateClassement(socket?: Socket) {
        const classement = await client.account.findMany({
            select: {
                devinciEmail: true,
                placedPixels: true,
            },
            orderBy: {
                placedPixels: "desc",
            },
            take: 10,
        });
        if (!socket) this.io.emit("classement-update", classement);
        else socket.emit("classement-update", classement);
    }

    /**
     * Sends an 'updateCanvasSize' event to all connected clients.
     * @param width The new canvas width
     * @param height The new canvas height
     */

    static async updateCanvasSize(width: number, height: number) {
        this.io.emit("canvas-size-update", width, height);
    }

    /**
     * Sends an 'updateConnectedUsers' event to all connected clients.
     */
    static async updateConnectedUsers() {
        this.io.emit("connected-users-update", this.io.engine.clientsCount);
    }

    /**
     * Sends a 'resetCanvas' event to all connected clients.
     */
    static async resetCanvas() {
        this.io.emit("canvas-reset");
    }

    /**
     * Broadcast a message to everyone
     * @param senderEmail The devinciEmail of the sender
     * @param message The message
     */
    static async broadcastMessage(senderEmail: string, message: string) {
        this.io.emit("message", senderEmail, message);
    }

    /**
     * Broadcast a toast change to everyone
     * @param toast The new toast message
     */
    static async broadcastToast(toast: string) {
        this.io.emit("toast", toast);
    }

    /**
     * Sends an 'updateCanvasPixel' event to all connected clients.
     * @param x The x coordinate of the pixel
     * @param y The y coordinate of the pixel
     * @param color The color of the pixel
     */
    static async updateCanvasPixel(x: number, y: number, color: number[]) {
        this.io.emit("canvas-pixel-update", x, y, color);
    }

    static async updateColorPalette(palette: number[][]) {
        this.io.emit("canvas-palette-update", palette);
    }

    /**
     * Sends an 'updateUserData' event to all connected clients.
     * @param socket The socket of the user
     * @param user The user data
     */
    static async updateUserData(socket: Socket, user: unknown) {
        const data = user as {
            placedPixels: number;
            lastPixelTime: Date;
            messagesSent: number;
        };

        socket.emit("user-data-update", { ...data, startTime: this._startTime });
    }

    /**
     * Sends an 'updatePixelPlacementCooldown' event to all connected clients.
     * @param time The time in seconds
     */
    static async updatePixelPlacementCooldown(time: number) {
        this.io.emit("pixel-placement-cooldown-update", time);
    }

    /**
     * Sends an 'force-refresh' event to all connected clients.
     */
    static async forceRefresh() {
        this.io.emit("force-refresh");
    }
}

export default WSS;
