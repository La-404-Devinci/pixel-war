import Canvas from "../models/Canvas";
import type PlacePixelPayload from "common/requests/PlacePixel";
import type express from "express";
import type SocketIO from "socket.io";

class CanvasController {
    private static canvas: Canvas;

    public static async init() {
        // TODO: Initialize the canvas from the database or create a new one if it doesn't exist
        /**
         * VALIDATION
         * * Check if the canvas exists in the database
         *
         * PROCESS
         * * Create a new canvas if it doesn't exist
         * * Load the canvas from the database
         *
         * RESPONSE
         * * Set the canvas property
         * * Log the canvas initialization
         */
    }

    /**
     * Get the canvas image
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async getCanvasImage(req: express.Request, res: express.Response) {
        // TODO: Send the canvas image as a response
    }

    /**
     * Place a pixel on the canvas
     * @server WebSocket
     *
     * @param socket The socket that sent the pixel data
     * @param data The payload
     */
    public static async placePixel(socket: SocketIO.Socket, ...data: unknown[]) {
        // TODO: Place the pixel on the canvas
        /**
         * VALIDATION
         * * Validate the pixel data
         * * Check if the user timer is elapsed
         *
         * PROCESS
         * * Log the pixel placement
         * * Update the pixel on the canvas
         * * Update the user timer (if the user is not an admin)
         *
         * RESPONSE
         * * Broadcast the modification to all clients
         * * Send the updated user data to the client
         * * Send the updated leaderboard to the client
         */
    }

    // Admin routes
    /**
     * Reset the canvas
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async resetCanvas(req: express.Request, res: express.Response) {
        // TODO: Reset the canvas and log the action
        /**
         * VALIDATION
         * * Check if the user is an admin
         *
         * PROCESS
         * * Reset the canvas in the database
         * * Log the canvas reset
         *
         * RESPONSE
         * * Send a success response
         * * Broadcast the canvas reset to all clients
         * * Send the updated leaderboard to all clients
         * * Send the updated user data to all clients
         * * Send the updated canvas to all clients
         */
    }

    /**
     * Change the canvas size
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async changeCanvasSize(req: express.Request, res: express.Response) {
        // TODO: Change the canvas size and log the action
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the new canvas size
         *
         * PROCESS
         * * Change the canvas size in the database
         * * Log the canvas size change
         *
         * RESPONSE
         * * Send a success response
         * * Broadcast the canvas size change to all clients
         * * Send the updated leaderboard to all clients
         * * Send the updated user data to all clients
         * * Send the updated canvas to all clients
         */
    }

    /**
     * Change the pixel placement cooldown
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async changePixelPlacementCooldown(req: express.Request, res: express.Response) {
        // TODO: Change the pixel placement cooldown and log the action
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the new cooldown
         *
         * PROCESS
         * * Change the pixel placement cooldown in the database
         * * Log the pixel placement cooldown change
         *
         * RESPONSE
         * * Send a success response
         * * Broadcast the pixel placement cooldown change to all clients
         * * Send the updated leaderboard to all clients
         * * Send the updated user data to all clients
         * * Send the updated canvas to all clients
         */
    }

    /**
     * Edit the canvas color palette
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async editCanvasColorPalette(req: express.Request, res: express.Response) {
        // TODO: Edit the canvas color palette and log the action
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the new color palette
         *
         * PROCESS
         * * Edit the canvas color palette in the database
         * * Log the canvas color palette edit
         *
         * RESPONSE
         * * Send a success response
         * * Broadcast the canvas color palette edit to all clients
         * * Send the updated leaderboard to all clients
         * * Send the updated user data to all clients
         * * Send the updated canvas to all clients
         */
    }
}

export default CanvasController;
