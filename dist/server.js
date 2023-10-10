"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const messages_1 = require("./utils/messages");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const path = require("path");
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
dotenv_1.default.config();
const PORT = 3000 || process.env.PORT;
app.use(express_1.default.static(path.join(__dirname, "../public")));
// Run when client connects
io.on("connection", (socket) => {
    console.log("New WS Connection...");
    socket.on("joinRoom", ({ username, room }) => {
        socket.join(username);
    });
    // Listen for chatMessage
    socket.on("chatMessage", (msg, receiver) => {
        console.log(msg);
        io.to(receiver).emit("message", (0, messages_1.formatMessage)(msg.username, msg.text));
    });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
