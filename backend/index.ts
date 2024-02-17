import express from "express";
import http from "http";
import { Socket } from "socket.io";
import dotenv from "dotenv";
import WSS from "./server/Websocket";
import AccountController from "./controllers/Account";
import CanvasController from "./controllers/Canvas";
import ChatController from "./controllers/Chat";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Create Socket.io server
WSS.init(server);

WSS.io.on("connection", (socket: Socket) => {
    const ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
    const userAgent = socket.handshake.headers["user-agent"];
    console.log(`Socket connected from ${ip} using ${userAgent}`);

    socket.on("place-pixel", (data) => CanvasController.placePixel(data, socket));
    socket.on("message", (data) => ChatController.broadcastMessage(data, socket));

    socket.on('ev', (data) => {
      console.log(data)
    })

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

// Express routes
app.post("/auth/send-magic-link", AccountController.sendMagicLink);
app.post("/auth/login", AccountController.login);
app.get("/canvas/image", CanvasController.getCanvasImage);

app.post("/admin/auth/mute", AccountController.muteUser);
app.post("/admin/auth/ban", AccountController.banUser);
app.post("/admin/canvas/reset", CanvasController.resetCanvas);
app.post("/admin/canvas/size", CanvasController.changeCanvasSize);
app.post("/admin/canvas/countdown", CanvasController.changePixelPlacementCooldown);
app.post("/admin/canvas/palette", CanvasController.editCanvasColorPalette);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
