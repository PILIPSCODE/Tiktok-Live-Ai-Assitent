import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupTiktokEvents } from "./handlers/tiktokEvents.js";
import { TikTokConnectionWrapper } from "./connectionWrapper.js";
import { isChatEnd } from "./utils/isProcessing.js";

dotenv.config();

const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:3000", transports: ["websocket"] }));

io.on("connection", (socket) => {
  let tiktokLiveConnection;
  console.log("a new client connected");

  socket.on("username", (data, options) => {
    socket.join(data);

    if (typeof options === "object" && options) {
      delete options.requestOptions;
      delete options.websocketOptions;
    } else {
      options = {};
    }

    if (data == "") return;
    try {
      tiktokLiveConnection = new TikTokConnectionWrapper(data, options, true, {
        requestConfig: {
          timeout: 30000,
        },
      });
      tiktokLiveConnection.connect();
    } catch (error) {
      console.log(error);
    }
    if(tiktokLiveConnection){
      setupTiktokEvents(io, data, tiktokLiveConnection);
    }
  });
  
  socket.on("callback", (data) => {
    isChatEnd(data);
  });

  socket.on("manualy-disconnect", () => {
    console.log("user disconnected");
    if (tiktokLiveConnection) {
      tiktokLiveConnection.disconnect();
  }
  })
  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (tiktokLiveConnection) {
      tiktokLiveConnection.disconnect();
  }
  });
});

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
