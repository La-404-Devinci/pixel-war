import express from "express";
import WSS from "../server/Websocket";

class GoofyController {
    private static _tracks: string[] = [];
    private static _banned: string[] = [];
    private static _toast?: string = undefined;

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
            if (req.ip && !GoofyController._tracks.includes(req.ip)) {
                GoofyController._tracks.push(req.ip);
            }

            const gifs = [
                "https://media1.tenor.com/m/yNMGjXsoYGUAAAAd/cat-cats.gif",
                "https://media1.tenor.com/m/w0dZ4Eltk7IAAAAC/vuknok.gif",
                "https://media.discordapp.net/attachments/1157327908206039131/1216380347806253206/wonhophilia-wonho.png?ex=66002d7a&is=65edb87a&hm=e088e9a2332700364553c9a11bd51519b90fbdecb815f9e6744937bad6dd61f8&=&format=webp&quality=lossless",
                "https://media.discordapp.net/attachments/1157327908206039131/1216380454857347159/images.png?ex=66002d93&is=65edb893&hm=7666046ab5767f8e9e46cc697c745a342883265245dba44b524926ff699efae4&=&format=webp&quality=lossless",
                "https://media.discordapp.net/attachments/1157327908206039131/1216380529994236025/cat-cat-meme.png?ex=66002da5&is=65edb8a5&hm=c3ed07f70c8dc711461c19e30e852d8eb1e346e9c89a46f64c671aa3e5fb09bc&=&format=webp&quality=lossless",
                "https://media1.tenor.com/m/7t63GFnoIPUAAAAd/huh-cat-huh-m4rtin.gif",
                "https://media1.tenor.com/m/Wyjcf1uN1AoAAAAd/cat-zoning-out-cat-stare.gif",
                "https://media1.tenor.com/m/Z_eqWILr0D4AAAAd/cat-meme.gif",
                "https://media1.tenor.com/m/t7_iTN0iYekAAAAd/sad-sad-cat.gif",
                "https://media1.tenor.com/m/j187HFUy45YAAAAd/wtf-cat-grrrr.gif",
            ];

            res.send(`
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <img src="${gifs[Math.floor(Math.random() * gifs.length)]}" alt="Goofy" style="width: 300px; height: 300px; margin-bottom: 20px;">
                <h1>Goofy ahh hecker</h1>
                <p>There are ${GoofyController._tracks.length} hacker(s) trying to hack the server</p>
                <p><b>Btw here are the banned IPs:</b></p>
                <p>${GoofyController._banned.join(", ")}</p>
                <p>Good luck!</p>
            </div>
        `);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Force refresh the user's page
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async forceRefresh(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            WSS.forceRefresh();
            res.status(200).send("Refreshed");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ban an IP
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async banIP(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { ip, isBanned } = req.body;

            if (isBanned) {
                if (!GoofyController._banned.includes(ip)) GoofyController._banned.push(ip);
            } else {
                const index = GoofyController._banned.indexOf(ip);
                if (index > -1) {
                    GoofyController._banned.splice(index, 1);
                }
            }

            res.status(200).send(isBanned ? "Banned" : "Unbanned");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get the list of banned IPs
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getBannedIPs(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.status(200).json(GoofyController._banned);
        } catch (error) {
            next(error);
        }
    }

    public static isBanned(ip: string): boolean {
        return GoofyController._banned.includes(ip);
    }

    /**
     * Edit the toast message
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async sendToast(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { toast } = req.body;

            GoofyController._toast = toast;
            WSS.broadcastToast(toast);

            res.status(200).send("Toast sent");
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get the toast message
     * @server HTTP
     *
     * @param req The Express request object
     * @param res The Express response object
     * @param next The Express next function
     */
    public static async getToast(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.status(200).json({
                toast: GoofyController._toast || null,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default GoofyController;
