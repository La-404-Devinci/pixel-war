import type express from "express";

const verifyUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        if (!req.account.isAdmin) return res.status(403).send("Unauthorized");

        next();
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

export default verifyUser;
