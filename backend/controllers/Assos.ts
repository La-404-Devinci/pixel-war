import express from "express";
import assos from "../data/assos.json";

class AssosController {
    /**
     * Get all assos
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     */
    public static async getAssos(req: express.Request, res: express.Response) {
        res.json(assos);
    }
}

export default AssosController;
