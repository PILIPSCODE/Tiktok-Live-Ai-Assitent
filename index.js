import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectWithRetry, tiktokLiveConnection } from "./TIktok.js";
import { setupTiktokEvents } from "./handlers/tiktokEvents.js";

dotenv.config();

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://127.0.0.1:5500" }));

connectWithRetry();
setupTiktokEvents(io, tiktokLiveConnection);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
