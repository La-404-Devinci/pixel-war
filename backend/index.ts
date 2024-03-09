import express from "express";
import http from "http";
import { Socket } from "socket.io";
import dotenv from "dotenv";
import WSS from "./server/Websocket";

import verifyUser from "./middlewares/verifyUser";
import verifyAdmin from "./middlewares/verifyAdmin";

import AccountController from "./controllers/Account";
import CanvasController from "./controllers/Canvas";
import ChatController from "./controllers/Chat";
import GoofyController from "./controllers/Goofy";
import AssosController from "./controllers/Assos";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:5173");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}
// Create Socket.io server
WSS.init(server);

WSS.io.on("connection", (socket: Socket) => {
    const ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
    const userAgent = socket.handshake.headers["user-agent"];
    console.log(`Socket connected from ${ip} using ${userAgent}`);

    try {
        socket.on("auth", (...data) => {
            const [token, email] = data;
            AccountController.authSocket(socket, [token, email]);
        });

        socket.on("place-pixel", (...data) => {
            const [x, y, color, callback] = data;
            CanvasController.placePixel(socket, [x, y, color, callback]);
        });

        socket.on("message", (...data) => {
            const [message, callback] = data;
            ChatController.broadcastMessage(socket, [message, callback]);
        });

        // TODO: Is this necessary?
        WSS.updateClassement(socket);
    } catch (e) {
        socket.emit("error", "An error occurred");
        console.error(e);
    }

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

// Logs
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.ip} | ${req.method} ${req.path}`);
    next();
});

// Express routes
app.post("/auth/send-magic-link", AccountController.sendMagicLink);
app.get("/auth/login", AccountController.login);
app.get("/canvas/image", CanvasController.getCanvasImage);

// Asso routes
app.post("/api/asso", verifyUser, AccountController.setAssociation);

// Messages routes
app.get("/messages", ChatController.getMessages);

// Admin routes
const router = express.Router();

router.use(verifyUser);
router.use(verifyAdmin);

router.post("/auth/ban", AccountController.banUser);
router.post("/auth/mute", AccountController.muteUser);
router.post("/canvas/reset", CanvasController.resetCanvas);
router.post("/canvas/size", CanvasController.changeCanvasSize);
router.post("/canvas/countdown", CanvasController.changePixelPlacementCooldown);
router.post("/canvas/palette", CanvasController.editCanvasColorPalette);

app.use("/admin", router);

// Goofy routes
app.get("/admin", GoofyController.getAdminPage);

// Info routes
app.get("/assos", AssosController.getAssos);

// Error handling
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    } else {
        next();
    }
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
