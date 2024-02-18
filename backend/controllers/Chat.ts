import {Socket} from "socket.io";
import ChatMessagePayload from "../../common/requests/ChatMessagePayload";

class ChatController {
    /**
     * Broadcasts a message to all connected clients
     * @server WebSocket
     *
     * @param data The message data
     * @param socket The client socket
     */
    public static async broadcastMessage(data: ChatMessagePayload, socket: Socket) {
        // TODO: Broadcast the message to all clients
        /**
         * VALIDATION
         * * Validate the message data
         * * Check if the user is logged in
         * * Check if the user is not muted
         * * Check if the user has sent more that 3 messages in the last 5 seconds
         * * - Mute the user for 3 secondes (1st time)
         * * - Mute the user for 10 secondes (2nd time)
         * * - Mute the user for 1 minute (3rd time)
         * * - Mute the user for 5 minutes (4th time)
         * * - Mute the user for 30 minutes (5th time)
         * * - Mute the user for 1 hour (6th time)
         * * - Mute the user for 2 hours (7th time)
         * * - Mute the user for 12 hours (8th time)
         * * - Mute the user for 24 hours (9th time)
         * * - Mute the user definitively (10th time)
         * * Check if the message is not longer than 200 characters
         * * Check if the message is not empty
         * * Check if the message does not contain any bad words
         * * Check if the message does not contain any links
         *
         * PROCESS
         * * Log the message
         *
         * RESPONSE
         * * Broadcast the message to all clients
         */
    }
}

export default ChatController;
