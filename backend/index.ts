import express from "express";
import http from "http";
import { Socket } from "socket.io";
import dotenv from "dotenv";
import WSS from "./server/Websocket";

// Load environment variables from .env file
dotenv.config();

// Import route controllers
// TODO: Import the GetCanvas function from the CanvasController file
// import { GetCanvas } from "./controllers/CanvasController";
// TODO: Create others controllers for the user and auth routes

// Import websocket endpoints
// TODO: Import the PlacePixel function from the CanvasController file
// import { PlacePixel } from "./routes/canvas/CanvasController";
// TODO: Create others websocket endpoints for the user and auth routes

// Create Express app
const app = express();
const server = http.createServer(app);

// Create Socket.io server
WSS.init(server);

WSS.io.on("connection", (socket: Socket) => {
    const ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
    const userAgent = socket.handshake.headers["user-agent"];
    console.log(`Socket connected from ${ip} using ${userAgent}`);

    // // Socket.io events
    // socket.on("placePixel", PlacePixel);

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

// // Express routes
// app.get("/canvas", GetCanvas);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
