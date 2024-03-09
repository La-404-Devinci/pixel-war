import type SocketIO from "socket.io";
import express from "express";
import nodemailer from "nodemailer";
import {
    generateAuthenticationToken,
    generateAuthorizationToken,
    verifyAuthorizationToken,
    verifyAuthenticationToken,
} from "../auth/tokenUtils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class AccountController {
    /**
     * Send a magic link to the user's email
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async sendMagicLink(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { email } = req.body;
            const expression: RegExp = /^[a-zA-Z0-9._-]+@edu\.devinci\.fr$/;

            if (!expression.test(email)) {
                return res.status(400).send("Email non valide");
            }

            const token: string = generateAuthorizationToken(email);
            const link: string = `${process.env.API_URL}/auth/login?token=${token}&email=${email}`;

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT ?? "587"),
                secure: process.env.EMAIL_SECURE === "true",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const message = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Lien pour se connecter",
                html: `Clique pour te connecter: <a href="${link}">${link}</a>`,
            };

            await transporter.sendMail(message);
            res.status(200).send("Lien envoyé. Regardez vos mails.");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Log the user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { token, email } = req.query;

            if (typeof token !== "string" || typeof email !== "string") {
                return res.status(400).send("Invalid query parameters");
            }

            if (!verifyAuthorizationToken(token, email)) {
                return res.status(401).send("Invalid token");
            }

            try {
                const user = await prisma.account.findFirst({
                    where: {
                        devinciEmail: email,
                    },
                });

                if (!user) {
                    await prisma.account.create({
                        data: {
                            devinciEmail: email,
                        },
                    });
                }
            } catch (error) {
                return res.status(500).send("Unable to connect to the database");
            }

            res.cookie("token", generateAuthenticationToken(email), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            });

            res.cookie("email", email, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            });

            return res.redirect(process.env.FRONTEND_URL ?? "/");
        } catch (error) {
            next(error);
        }
    }

    // Admin routes
    /**
     * Mute/unmute a user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async muteUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { userId, isMuted } = req.body;

            prisma.account
                .update({
                    where: {
                        id: userId,
                    },
                    data: {
                        isMuted: isMuted,
                    },
                })
                .then(() => {
                    res.status(200).send("Utilisateur muté");
                })
                .catch(() => {
                    res.status(500).send("Une erreur s'est produite.");
                });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ban/unban a user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async banUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { userId, isBanned } = req.body;

            try {
                await prisma.account.update({
                    where: { id: userId },
                    data: { isBanned: isBanned },
                });

                res.status(200).send("Successful");
            } catch (error) {
                res.status(500).send("Not successful");
                return;
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * Auth a websocket client
     * @server WebSocket
     *
     * @param socket The client socket
     * @param data The payload
     */
    public static async authSocket(socket: SocketIO.Socket, [token, email]: [string, string]) {
        if (verifyAuthenticationToken(token, email)) {
            socket.data.token = token;
            socket.data.email = email;

            socket.emit("auth-callback", true);
        } else {
            socket.emit("auth-callback", false);
        }
    }

    /**
     * Edit the user's association
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async setAssociation(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { association } = req.body;

            if (!association) return res.status(400).send("Association is required");

            try {
                await prisma.account.update({
                    where: {
                        devinciEmail: req.account.devinciEmail,
                    },
                    data: {
                        association,
                    },
                });

                // Log the action
                prisma.logEntry.create({
                    data: {
                        devinciEmail: req.account.devinciEmail,
                        time: new Date().getTime(),
                        ip: req.ip || "Unknown",
                        action: {
                            type: "set_association",
                        },
                    },
                });

                res.status(200).send("Association updated");
            } catch (error) {
                res.status(500).send("Unable to connect to the database");
            }
        } catch (error) {
            next(error);
        }
    }
}

export default AccountController;
