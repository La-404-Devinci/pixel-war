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
     */
    public static async sendMagicLink(
        req: express.Request,
        res: express.Response
    ) {
        // TODO: Send a magic link containing the AUTHORIZATION token to the user's email
        /**
         * VALIDATION
         * * Validate the user email (must be a Devinci email)
         *
         
         * PROCESS
         * * Generate an AUTHORIZATION token
         * * Send the magic link to the user's email
         *
         * RESPONSE
         * * Send a success message
         * * Send an error message if the email is invalid
         */
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
            secure: true,
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

        try {
            await transporter.sendMail(message);
            res.status(200).send("Lien envoyé. Regarder vos mails.");
        } catch (error) {
            res.status(500).send("Une erreur s'est produite.");
        }
    }

    /**
     * Log the user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async login(req: express.Request, res: express.Response) {
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
    }

    // Admin routes
    /**
     * Mute/unmute a user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async muteUser(req: express.Request, res: express.Response) {
        // TODO: Mute/unmute a user
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the user ID
         *
         * PROCESS
         * * Mute/unmute the user
         *
         * RESPONSE
         * * Send a success message
         * * Send an error message if the user ID is invalid
         */
    }

    /**
     * Ban/unban a user
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async banUser(req: express.Request, res: express.Response) {
        // TODO: Ban/unban a user
        /**
         * VALIDATION
         * * Check if the user is an admin
         * * Validate the user ID
         *
         * PROCESS
         * * Ban/unban the user
         *
         * RESPONSE
         * * Send a success message
         * * Send an error message if the user ID is invalid
         */
        const { userId, command } = req.body;


        try {
            await prisma.account.findUnique({
                where: { 
                    id: userId,
                    isAdmin: false 
                }
            });

            res.status(200).send("User is not admin");
        } catch (error) {
            res.status(500).send("User is admin");
            return; 
        }

        try {
            await prisma.account.update({
                where: { id: userId },
                data: { isBanned: command }
            });
      
            res.status(200).send("Successful");
        } catch (error) {
            res.status(500).send("Not successful");
            return; 
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
}

export default AccountController;