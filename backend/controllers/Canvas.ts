import type express from "express";
import type SocketIO from "socket.io";

import WSS from "../server/Websocket";
import Canvas from "../models/Canvas";

class CanvasController {
    private static _canvas: Canvas = {
        pixels: Buffer.alloc(1024 * 1024 * 4),
        changes: 0,
        width: 1024,
        height: 1024,
    };

    /**
     * Get the canvas image
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async getCanvasImage(
        req: express.Request,
        res: express.Response
    ) {
        res.status(200).json({
            pixels: this._canvas.pixels,
            width: this._canvas.width,
            height: this._canvas.height,
        });
    }

    /**
     * Place a pixel on the canvas
     * @server WebSocket
     *
     * @param socket The socket that sent the pixel data
     * @param data The payload
     */
    public static async placePixel(
        socket: SocketIO.Socket,
        [x, y, palette]: [number, number, number]
    ) {
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
    public static async resetCanvas(
        req: express.Request,
        res: express.Response
    ) {
        // TODO: Log the canvas reset
        console.log("Canvas reset");

        this._canvas.changes = 0;
        this._canvas.pixels.fill(0);

        WSS.resetCanvas();

        res.status(200).send("Canvas reset");
    }

    /**
     * Change the canvas size
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async changeCanvasSize(
        req: express.Request,
        res: express.Response
    ) {
        const { height, width }: { height: number; width: number } = req.body;

        if (width < 0 || height < 0) {
            return res.status(400).send("Invalid canvas size");
        } else if (width > 1024 || height > 1024) {
            return res.status(400).send("Canvas size too large");
        }

        this._canvas.changes++;
        this._canvas.width = width;
        this._canvas.height = height;

        // TODO: Log the canvas size change
        console.log(`Canvas size changed to ${width}x${height}`);

        WSS.updateCanvasSize(width, height);

        res.status(200).send("Canvas size changed");
    }

    /**
     * Change the pixel placement cooldown
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async changePixelPlacementCooldown(
        req: express.Request,
        res: express.Response
    ) {
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
    public static async editCanvasColorPalette(
        req: express.Request,
        res: express.Response
    ) {
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
