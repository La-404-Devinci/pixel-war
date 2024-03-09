import express from "express";

class GoofyController {
    private static _tracks: string[] = [];

    /**
     * Get the admin page
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getAdminPage(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            // Add ip to tracks
            if (req.ip && !this._tracks.includes(req.ip)) {
                this._tracks.push(req.ip);
            }

            res.send(`
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <img src="https://media1.tenor.com/m/yNMGjXsoYGUAAAAd/cat-cats.gif" alt="Goofy" style="width: 300px; height: 300px; margin-bottom: 20px;">
                <h1>Goofy</h1>
                <p>There are ${this._tracks.length} hackers trying to hack the server</p>
                <p>Here are their IPs: ${this._tracks.join(", ")}</p>
                <p>Good luck!</p>
            </div>
        `);
        } catch (error) {
            next(error);
        }
    }
}

export default GoofyController;
