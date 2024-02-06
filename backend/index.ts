import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Import route controllers
// TODO: Import the GetCanvas function from the CanvasController file
import { GetCanvas } from "./controllers/CanvasController";
// TODO: Create others controllers for the user and auth routes

// Import websocket endpoints
// TODO: Import the PlacePixel function from the CanvasController file
import { PlacePixel } from "./routes/canvas/CanvasController";
// TODO: Create others websocket endpoints for the user and auth routes

// Create Express app
const app = express();
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server);

// Express routes
app.get("/canvas", GetCanvas);

// Socket.io events
io.on("connection", (socket: Socket) => {
    socket.on("placePixel", PlacePixel);
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
