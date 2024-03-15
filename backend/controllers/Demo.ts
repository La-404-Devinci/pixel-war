import { generateAuthorizationToken } from "../auth/tokenUtils";
import express from "express";

class DemoController {
    /**
     * Returns the demo status
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getDemo(req: express.Request, res: express.Response) {
        res.status(200).json({ demo: "🗿" });
    }

    /**
     * Logs the user in
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { username } = req.body;
            const email = `${username}@demo`;

            const token: string = generateAuthorizationToken(email);
            const link: string = `${process.env.API_URL}/auth/login?token=${token}&email=${email}`;

            res.status(200).json({ link });
        } catch (error) {
            next(error);
        }
    }
}

export default DemoController;
