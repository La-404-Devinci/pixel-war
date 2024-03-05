import type express from "express";
import type SocketIO from "socket.io";
import { PrismaClient } from "@prisma/client";

import WSS from "../server/Websocket";
import Canvas from "../models/Canvas";

const prisma = new PrismaClient();

class CanvasController {
    private static _canvas: Canvas = {
        pixels: Buffer.alloc(1024 * 1024 * 3), // 3 bytes per pixel (RGB)
        changes: 0,
        width: 1024, // Soft-width limit
        height: 1024, // Soft-height limit
        cooldown: 60, // Pixel placement cooldown in seconds
    };

    private static _palette: [number, number, number][] = [
        [255, 255, 255], // #FFFFFF
        [192, 192, 192], // #C0C0C0
        [0, 0, 0], // #000000
        [255, 0, 0], // #FF0000
        [0, 255, 0], // #00FF00
        [0, 0, 255], // #0000FF
        [255, 255, 0], // #FFFF00
        [0, 255, 255], // #00FFFF
        [255, 0, 255], // #FF00FF
    ];

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
        [x, y, palette, callback]: [
            number,
            number,
            number,
            (timer: number) => void,
        ]
    ) {
        // Get the user
        const user = await prisma.account.findFirst({
            where: {
                devinciEmail: socket.data.email,
            },
        });

        if (!user) return callback(0);
        if (user.isBanned) return callback(0);

        // Check if the user timer is elapsed
        if (
            user.lastPixelTime &&
            new Date(user.lastPixelTime).getTime() >
                new Date().getTime() - this._canvas.cooldown * 1000
        ) {
            return callback(
                new Date(user.lastPixelTime).getTime() -
                    new Date().getTime() +
                    this._canvas.cooldown * 1000
            );
        }

        if (
            x < 0 ||
            y < 0 ||
            x >= this._canvas.width ||
            y >= this._canvas.height
        )
            return callback(0);

        // Get pixel index (from the canvas buffer)
        const pixelIndex = (y * this._canvas.width + x) * 3;

        // Get palette item
        const color = this._palette[palette];
        if (!color) return callback(0);

        // Log the pixel placement
        prisma.logEntry.create({
            data: {
                devinciEmail: user.devinciEmail,
                time: new Date().getTime(),
                ip: socket.handshake.address,
                action: {
                    type: "pixel_placement",
                    x,
                    y,
                    color,
                },
            },
        });

        // Set the pixel
        this._canvas.pixels.writeUInt8(color[0], pixelIndex);
        this._canvas.pixels.writeUInt8(color[1], pixelIndex + 1);
        this._canvas.pixels.writeUInt8(color[2], pixelIndex + 2);

        // Update the user timer
        if (!user.isAdmin) {
            user.lastPixelTime = new Date();
            user.placedPixels++;

            await prisma.account.update({
                where: { id: user.id },
                data: {
                    lastPixelTime: new Date(),
                    placedPixels: user.placedPixels,
                },
            });
        }

        // Broadcast the modification to all clients
        WSS.updateCanvasPixel(x, y, color);
        WSS.updateUserData(socket, user);
        WSS.updateClassement(socket);
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
        prisma.logEntry.create({
            data: {
                devinciEmail: "anon",
                time: new Date().getTime(),
                ip: req.ip || "Unknown",
                action: {
                    type: "canvas_reset",
                },
            },
        });

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

        prisma.logEntry.create({
            data: {
                devinciEmail: "null",
                time: new Date().getTime(),
                ip: req.ip || "Unknown",
                action: {
                    type: "canvas_resize",
                    width,
                    height,
                },
            },
        });

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
        const { cooldown }: { cooldown: number } = req.body;

        if (cooldown < 0) return res.status(400).send("Invalid cooldown");

        this._canvas.cooldown = cooldown;

        prisma.logEntry.create({
            data: {
                devinciEmail: "anon",
                time: new Date().getTime(),
                ip: req.ip || "Unknown",
                action: {
                    type: "cooldown_change",
                    cooldown,
                },
            },
        });

        WSS.updatePixelPlacementCooldown(cooldown);

        res.status(200).send("Cooldown changed");
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

        const { colors } = req.body;

        if (colors.length != 8) {
            res.status(500).send("Must specify 9 colors");
            return;
        }

        colors.forEach((color: number[]) => {
            if (color.length != 3) {
                res.status(500).send("Color not recognized");
                return;
            }

            color.forEach((rgbValue: number) => {
                if (rgbValue < 0 || rgbValue > 255) {
                    res.status(500).send("Color not recognized");
                    return;
                }
            });
        });

        const newPalette: number[][] = [];

        for (const color of colors) {
            newPalette.push(color);
        }

        prisma.logEntry.create({
            data: {
                devinciEmail: "null",
                time: new Date().getTime(),
                ip: req.ip || "Unknown",
                action: {
                    type: "update_palette",
                    palette: newPalette,
                },
            },
        });

        WSS.updateColorPalette(newPalette);

        res.status(200).send("Palette updated");
    }
}

export default CanvasController;
