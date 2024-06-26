import type express from "express";
import { PrismaClient } from "@prisma/client";

import { verifyAuthenticationToken } from "../auth/tokenUtils";

const prisma = new PrismaClient();

const verifyUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.cookies.token;
        const devinciEmail = req.cookies.email;

        if (!token) return res.status(401).send("Authorization token required");
        if (!devinciEmail) return res.status(401).send("Devinci email required");

        if (!verifyAuthenticationToken(token, devinciEmail)) {
            return res.status(403).send("Invalid token");
        }

        const account = await prisma.account.findUnique({
            where: { devinciEmail },
        });

        if (!account) return res.status(404).send("Account not found");

        req.account = { ...account, lastSentMessageTimes: account.lastSentMessageTimes as number[] };

        next();
    } catch (error) {
        console.log("--- ERROR ---");
        console.log("Cookies:", req.cookies);
        console.log("Error:", error);
        console.log("--- ERROR ---");
        res.status(500).json("Internal server error (unable to verify user)");
    }
};

export default verifyUser;
