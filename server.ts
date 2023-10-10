import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { formatMessage } from "./utils/messages";
import http from "http";
import { Server, Socket } from "socket.io";
const app: Express = express();
const path = require("path");

const server = http.createServer(app);
const io = new Server(server);
dotenv.config();

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, "../public")));

// Run when client connects
io.on("connection", (socket: Socket) => {
    console.log("New WS Connection...");

    socket.on("joinRoom", ({ username, room }) => {
        socket.join(username);
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg, sender, receiver) => {
        console.log(msg,sender, receiver);
        io.to(receiver).emit("message", formatMessage(sender, msg));
        console.log('sender', sender);
        socket.broadcast.to(sender).emit("message", formatMessage(sender, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
        console.log("User has left the chat");
    }
    );
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
