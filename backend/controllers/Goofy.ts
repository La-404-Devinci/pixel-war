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
                <p><b>Here are their IPs:</b><br/>${GoofyController._tracks.join("<br/>")}</p>
                <p>Good luck!</p>
            </div>
        `);
        } catch (error) {
            next(error);
        }
    }
}

export default GoofyController;
