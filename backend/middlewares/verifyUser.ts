import type express from "express";
import { PrismaClient } from "@prisma/client";

import { verifyAuthenticationToken } from "../auth/tokenUtils";

const prisma = new PrismaClient();

const verifyUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const bearer: string = req.headers.authorization || "";
        const token: string = bearer.split(" ")[1];

        const devinciEmail = req.cookies.devinciEmail;

        if (!token) return res.status(401).send("Authorization token required");
        if (!devinciEmail) return res.status(401).send("Devinci email required");

        if (!verifyAuthenticationToken(token, devinciEmail)) {
            return res.status(403).send("Invalid token");
        }

        const account = await prisma.account.findUnique({
            where: { devinciEmail },
        });

        if (!account) return res.status(404).send("Account not found");

        req.account = account;

        next();
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

export default verifyUser;