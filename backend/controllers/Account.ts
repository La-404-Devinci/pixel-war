import express from "express";
import nodemailer from "nodemailer";
import {
    generateAuthenticationToken,
    generateAuthorizationToken,
    verifyAuthorizationToken,
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
        const { email } = req;

        const isDevinciEmail = (email: string): boolean => {
            const expression: RegExp = /^[a-zA-Z0-9._-]+@edu\.devinci.fr$/;

            return expression.test(email);
        };

        if (isDevinciEmail(email) == true) {
            const token: string = generateAuthorizationToken(email);
            const link: string = `url/login?token=${token}`;

            const transporter = nodemailer.createTransport({
                host: "your_host",
                port: 587,
                secure: true,
                auth: {
                    user: "your_email_address",
                    pass: "your_email_password",
                },
            });

            const message = {
                from: "your_email",
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
        } else {
            res.send("Email non valide");
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
        const { token, email } = req.body;
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
            return res.status(500).send("Internal server error");
        }

        return res.status(200).send(generateAuthenticationToken(email));
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
    }
}

export default AccountController;
