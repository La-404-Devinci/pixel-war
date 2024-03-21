import type express from "express";

const verifyUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (!req.headers.authorization) return res.status(403).send("Unauthorized");

        if (req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) return res.status(403).send("Unauthorized");

        next();
    } catch (error) {
        console.log("--- ERROR ---");
        console.log("Cookies:", req.cookies);
        console.log("Error:", error);
        console.log("--- ERROR ---");
        res.status(500).json("Internal server error");
    }
};

export default verifyUser;
