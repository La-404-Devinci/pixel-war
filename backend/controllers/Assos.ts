import express from "express";
import assos from "../database/assos";

class AssosController {
    /**
     * Get all assos
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getAssos(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.status(200).json(assos);
        } catch (error) {
            next(error);
        }
    }
}

export default AssosController;
