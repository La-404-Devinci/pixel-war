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
        width: 50, // Soft-width limit
        height: 50, // Soft-height limit
        cooldown: 120, // Pixel placement cooldown in seconds
    };

    private static _palette: [number, number, number][] = [
        [255, 255, 255], // #FFFFFF
        [255, 255, 255], // #FFFFFF
        [255, 255, 255], // #FFFFFF
    ];

    public static init() {
        // Fill the canvas with white pixels
        CanvasController._canvas.pixels.fill(255);
    }

    /**
     * Get the canvas image
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getCanvasImage(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.status(200).json({
                pixels: CanvasController._canvas.pixels,
                width: CanvasController._canvas.width,
                height: CanvasController._canvas.height,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get the canvas color palette
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getCanvasPalette(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.status(200).json(CanvasController._palette);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Place a pixel on the canvas
     * @server WebSocket
     *
     * @param socket The socket that sent the pixel data
     * @param data The payload
     */
    public static async placePixel(socket: SocketIO.Socket, [x, y, palette, callback]: [number, number, number, (timer: number) => void]) {
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
            new Date(user.lastPixelTime).getTime() > new Date().getTime() - CanvasController._canvas.cooldown * 1000
        ) {
            // Return the "expires at" time
            return callback(new Date(user.lastPixelTime).getTime() + CanvasController._canvas.cooldown * 1000);
        }

        if (x < 0 || y < 0 || x >= CanvasController._canvas.width || y >= CanvasController._canvas.height) return callback(0);

        // Get pixel index (from the canvas buffer)
        const pixelIndex = (y * 1024 + x) * 3;

        // Get palette item
        const color = CanvasController._palette[palette];
        if (!color) return callback(0);

        // Log the pixel placement
        await prisma.logEntry.create({
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

        CanvasController._canvas.pixels.writeUInt8(color[0], pixelIndex);
        CanvasController._canvas.pixels.writeUInt8(color[1], pixelIndex + 1);
        CanvasController._canvas.pixels.writeUInt8(color[2], pixelIndex + 2);

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
        WSS.updateClassement();

        // Send the "expires at" time
        callback(new Date().getTime() + CanvasController._canvas.cooldown * 1000);
    }

    /**
     * Get the pixel history
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getPixelHistory(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { x, y }: { x: number; y: number } = req.query as unknown as { x: number; y: number };

            // ! Note: this is trash code, but it's the only way to do it :(

            const history = await prisma.$queryRawUnsafe(
                `SELECT * FROM LogEntry
                WHERE action LIKE '%"type": "pixel_placement"%'
                AND action LIKE '%"x": ${x}%'
                AND action LIKE '%"y": ${y}%'
                ORDER BY "time" DESC
                LIMIT 5`,
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsedHistory = (history as any).map((entry: { [x: string]: any }) => {
                // Remove unnecessary data
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ip, ...data } = entry;

                // Serialize time
                const time = entry.time.toString();
                const action = JSON.parse(data.action);
                return { ...data, time, action };
            });

            res.status(200).json({
                x,
                y,
                history: parsedHistory,
            });
        } catch (error) {
            next(error);
        }
    }

    // Admin routes
    /**
     * Reset the canvas
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async resetCanvas(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            await prisma.logEntry.create({
                data: {
                    devinciEmail: "anon",
                    time: new Date().getTime(),
                    ip: req.ip || "Unknown",
                    action: {
                        type: "canvas_reset",
                    },
                },
            });

            CanvasController._canvas.changes = 0;
            CanvasController._canvas.pixels.fill(255);

            WSS.resetCanvas();
            WSS.forceRefresh();

            res.status(200).send("Canvas reset");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change the canvas size
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async changeCanvasSize(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { height, width }: { height: number; width: number } = req.body;

            if (width < 0 || height < 0) {
                return res.status(400).send("Invalid canvas size");
            } else if (width > 1024 || height > 1024) {
                return res.status(400).send("Canvas size too large");
            }

            CanvasController._canvas.changes++;
            CanvasController._canvas.width = width;
            CanvasController._canvas.height = height;

            await prisma.logEntry.create({
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
            WSS.forceRefresh();

            res.status(200).send("Canvas size changed");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change the pixel placement cooldown
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async changePixelPlacementCooldown(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { cooldown }: { cooldown: number } = req.body;

            if (cooldown < 0) return res.status(400).send("Invalid cooldown");

            CanvasController._canvas.cooldown = cooldown;

            await prisma.logEntry.create({
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
        } catch (error) {
            next(error);
        }
    }

    /**
     * Edit the canvas color palette
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async editCanvasColorPalette(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { colors } = req.body;

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

            await prisma.logEntry.create({
                data: {
                    devinciEmail: "null",
                    time: new Date().getTime(),
                    ip: req.ip || "Unknown",
                    action: {
                        type: "update_palette",
                        palette: colors,
                    },
                },
            });

            WSS.updateColorPalette(colors);
            CanvasController._palette = colors;

            res.status(200).send("Palette updated");
        } catch (error) {
            next(error);
        }
    }
}

export default CanvasController;
