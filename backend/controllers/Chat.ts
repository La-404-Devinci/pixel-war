import type SocketIO from "socket.io";
import { PrismaClient } from "@prisma/client";
import express from "express";

import leoProfanity from "leo-profanity";
import frenchBadwordsList from "french-badwords-list";
import WSS from "../server/Websocket";

leoProfanity.clearList();
leoProfanity.add(frenchBadwordsList.array);

const prisma = new PrismaClient();

class ChatController {
    private static _messageHistory: [string, string][] = [];

    /**
     * Broadcasts a message to all connected clients
     * @server WebSocket
     *
     * @param socket The client socket
     * @param data The payload
     */
    public static async broadcastMessage(socket: SocketIO.Socket, [message, callback]: [string, (success: boolean) => void]) {
        if (!message || message.length < 1 || message.length > 200) {
            console.log("Message is empty or too long");
            callback(false);
            return;
        }

        // Check if the message contains bad words
        const cleanMessage = leoProfanity.clean(message);

        if (!socket.data.email) {
            console.log("User is not authenticated");
            callback(false);
            return;
        }

        const user = await prisma.account.findFirst({
            where: {
                devinciEmail: socket.data.email,
            },
        });

        if (!user) {
            console.log("User not found");
            callback(false);
            return;
        }

        if (user.isMuted) {
            console.log("User is muted");
            callback(false);
            return;
        }

        const now = new Date();

        const lastTimestamps = ((user.lastSentMessageTimes as number[]) ?? []).filter((timestamp) => timestamp > now.getTime() - 5000);
        if (lastTimestamps.length > 4) {
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
            data: { lastSentMessageTimes: user.lastSentMessageTimes, messagesSent: user.messagesSent + 1 },
        });

        await prisma.logEntry.create({
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

        // Add the message to the history
        ChatController._messageHistory.push([user.devinciEmail, cleanMessage]);
        if (ChatController._messageHistory.length > 30) ChatController._messageHistory.shift();

        WSS.broadcastMessage(user.devinciEmail, cleanMessage);
        WSS.updateUserData(socket, user);

        callback(true);
    }

    /**
     * Returns the last 30 messages
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async getMessages(req: express.Request, res: express.Response) {
        res.json(ChatController._messageHistory);
    }
}

export default ChatController;
