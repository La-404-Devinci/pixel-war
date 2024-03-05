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

// Create Socket.io server
WSS.init(server);

WSS.io.on("connection", (socket: Socket) => {
    const ip =
        socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
    const userAgent = socket.handshake.headers["user-agent"];
    console.log(`Socket connected from ${ip} using ${userAgent}`);

    socket.on("auth", (...data) =>
        AccountController.authSocket(socket, ...data)
    );
    socket.on("place-pixel", (...data) =>
        CanvasController.placePixel(socket, ...data)
    );
    socket.on("message", (...data) =>
        ChatController.broadcastMessage(socket, ...data)
    );

    WSS.updateClassement(socket);

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

// Express routes
app.post("/auth/send-magic-link", AccountController.sendMagicLink);
app.get("/auth/login", AccountController.login);
app.get("/canvas/image", CanvasController.getCanvasImage);

// Asso routes
app.post("/api/asso", AccountController.setAssociation);

// Admin routes
const router = express.Router();
router.use(verifyUser);
router.use(verifyAdmin);
app.use("/admin", router);

router.post("/auth/ban", AccountController.banUser);
router.post("/auth/mute", AccountController.muteUser);
router.post("/canvas/reset", CanvasController.resetCanvas);
router.post("/canvas/size", CanvasController.changeCanvasSize);
router.post("/canvas/countdown", CanvasController.changePixelPlacementCooldown);
router.post("/canvas/palette", CanvasController.editCanvasColorPalette);

app.get("/admin", GoofyController.getAdminPage);
app.get("/assos", AssosController.getAssos);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
