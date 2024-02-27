import type SocketIO from "socket.io";
import { PrismaClient } from "@prisma/client";

import leoProfanity from "leo-profanity";
import frenchBadwordsList from "french-badwords-list";
import WSS from "../server/Websocket";

leoProfanity.clearList();
leoProfanity.add(frenchBadwordsList.array);

const prisma = new PrismaClient();

class ChatController {
    /**
     * Broadcasts a message to all connected clients
     * @server WebSocket
     *
     * @param socket The client socket
     * @param data The payload
     */
    public static async broadcastMessage(socket: SocketIO.Socket, [message, callback]: [string, (success: boolean) => void]) {
        if (!message || message.length < 1 || message.length > 200) {
            callback(false);
            return;
        }

        // Check if the message contains bad words
        const cleanMessage = leoProfanity.clean(message);

        if (!socket.data.email) {
            callback(false);
            return;
        }

        const user = await prisma.account.findFirst({
            where: {
                devinciEmail: socket.data.email,
            },
        });

        if (!user) {
            callback(false);
            return;
        }

        if (user.isMuted) {
            callback(false);
            return;
        }

        const now = new Date();

        const lastTimestamps = ((user.lastSentMessageTimes as number[]) ?? []).filter((timestamp) => timestamp > now.getTime() - 5000);
        if (lastTimestamps.length > 3) {
            user.isMuted = true;
            // Save the user
            await prisma.account.update({
                where: { id: user.id },
                data: { isMuted: true },
            });

            callback(false);
            return;
        }

        user.lastSentMessageTimes = [...lastTimestamps, now.getTime()];

        // Save the user
        await prisma.account.update({
            where: { id: user.id },
            data: { lastSentMessageTimes: user.lastSentMessageTimes },
        });

        prisma.logEntry.create({
            data: {
                devinciEmail: user.devinciEmail,
                time: new Date().getTime(),
                ip: socket.handshake.address,
                action: {
                    type: "message",
                    originalContent: message,
                    content: cleanMessage,
                },
            },
        });

        WSS.broadcastMessage(user.devinciEmail, cleanMessage);

        callback(true);
    }
}

export default ChatController;
