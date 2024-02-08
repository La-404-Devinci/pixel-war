"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Import route controllers
// TODO: Import the GetCanvas function from the CanvasController file
// import { GetCanvas } from "./controllers/CanvasController";
// TODO: Create others controllers for the user and auth routes
// Import websocket endpoints
// TODO: Import the PlacePixel function from the CanvasController file
// import { PlacePixel } from "./routes/canvas/CanvasController";
// TODO: Create others websocket endpoints for the user and auth routes
// Create Express app
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Create Socket.io server
const io = new socket_io_1.Server(server);
// // Express routes
// app.get("/canvas", GetCanvas);
// // Socket.io events
// io.on("connection", (socket: Socket) => {
//     socket.on("placePixel", PlacePixel);
// });
// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
