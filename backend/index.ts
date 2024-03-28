import express from "express";
import cookieParser from "cookie-parser";
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
import DemoController from "./controllers/Demo";

// Load environment variables from .env file
dotenv.config();

// Init database
CanvasController.init();
CanvasController.restore();

// Create Express app
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Fix proxy ip
app.set("trust proxy", true);

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
    const ip = socket.handshake.headers["x-forwarded-for"]?.toString() || socket.handshake.address;
    const userAgent = socket.handshake.headers["user-agent"];
    console.log(`Socket connected from ${ip} using ${userAgent}`);
    WSS.updateConnectedUsers();

    try {
        // Check if the user is banned
        if (GoofyController.isBanned(ip)) {
            socket.emit("error", "Sadly... you are banned!");
            socket.disconnect();
            return;
        }

        // Log every event
        socket.onAny((eventName, ...args) => {
            console.log(
                `${new Date().toISOString()} | ${ip} ${socket.data.email || "unauthenticated"} | ${eventName} ${JSON.stringify(args)}`,
            );
        });

        socket.on("auth", (...data) => {
            try {
                const [token, email] = data;
                AccountController.authSocket(socket, [token, email]);
            } catch (e) {
                console.error("SCKT-ERR:", e);
                console.log("SCKT-ERR: place-pixel email", socket.data.email);
            }
        });

        socket.on("place-pixel", (...data) => {
            try {
                const [x, y, color, callback] = data;
                CanvasController.placePixel(socket, [x, y, color, callback]);
            } catch (e) {
                console.error("SCKT-ERR:", e);
                console.log("SCKT-ERR: place-pixel email", socket.data.email);
            }
        });

        socket.on("message", (...data) => {
            try {
                const [message, callback] = data;
                ChatController.broadcastMessage(socket, [message, callback]);
            } catch (e) {
                console.error("SCKT-ERR:", e);
                console.log("SCKT-ERR: place-pixel email", socket.data.email);
            }
        });

        socket.on("get-stats", () => {
            try {
                AccountController.getStats(socket);
            } catch (e) {
                console.error("SCKT-ERR:", e);
                console.log("SCKT-ERR: place-pixel email", socket.data.email);
            }
        });

        socket.on("get-classement", () => {
            try {
                WSS.updateClassement(socket);
            } catch (e) {
                console.error("SCKT-ERR:", e);
                console.log("SCKT-ERR: place-pixel email", socket.data.email);
            }
        });
    } catch (e) {
        socket.emit("error", "An error occurred");
        console.error(e);
    }

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
        WSS.updateConnectedUsers();
    });
});

// Logs
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.ip} | ${req.method} ${req.path}`);
    next();
});

// Demo routes
if (process.env.DEMO === "true") {
    app.get("/demo", DemoController.getDemo);
    app.post("/demo/login", DemoController.login);
}

// Express routes
app.post("/auth/send-magic-link", AccountController.sendMagicLink);
app.get("/auth/login", AccountController.login);
app.get("/canvas/image", CanvasController.getCanvasImage);
app.get("/canvas/palette", CanvasController.getCanvasPalette);
app.get("/canvas/history", CanvasController.getPixelHistory);
app.get("/toast", GoofyController.getToast);

// Asso routes
if (process.env.DEMO !== "true") {
    app.post("/asso", verifyUser, AccountController.setAssociation);
    app.get("/asso", verifyUser, AccountController.getAssociation);
    app.get("/assos", AssosController.getAssos);
}

// Messages routes
app.get("/messages", ChatController.getMessages);

// Admin routes
const router = express.Router();

router.use(verifyAdmin);

router.get("/banip", GoofyController.getBannedIPs);
router.post("/banip", GoofyController.banIP);
router.post("/refresh", GoofyController.forceRefresh);
router.post("/clearchat", ChatController.clearMessages);
router.post("/toast", GoofyController.sendToast);

router.post("/auth/ban", AccountController.banUser);
router.post("/auth/mute", AccountController.muteUser);

router.post("/canvas/reset", CanvasController.resetCanvas);
router.post("/canvas/size", CanvasController.changeCanvasSize);
router.post("/canvas/countdown", CanvasController.changePixelPlacementCooldown);
router.post("/canvas/palette", CanvasController.editCanvasColorPalette);

router.post("/canvas/backup", async (req, res) => {
    CanvasController.backup();
    res.send("Backup done");
});

app.use("/a", router);

// Goofy routes
app.get("/admin", GoofyController.getAdminPage);

// Error handling
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
        console.log("--- ERROR ---");
        console.log("Method:", req.method);
        console.log("URL:", req.url);
        console.log("Body:", req.body);
        console.log("Error:", err);
        console.log("--- ERROR ---");
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

// Start backup probe
setInterval(
    () => {
        CanvasController.backup();
    },
    1000 * parseInt(process.env.BACKUP_INTERVAL || "180"),
);

console.log(`Backup probe started every ${process.env.BACKUP_INTERVAL || "180"} seconds`);
