import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupTiktokEvents } from "./handlers/tiktokEvents.js";
import { TikTokConnectionWrapper } from "./connectionWrapper.js";
import { isChatEnd } from "./utils/isProcessing.js";
import path from "path";
import ytsr from "ytsr";
import fsExtra from "fs-extra";
import fs from "fs";
import { fileURLToPath } from "url";
import { execCommand } from "./utils/exectCommand.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = 8000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "*", transports: ["websocket"] }));

const ytDlpPath = "/app/tools/yt-dlp";
const ffmpegPath = "/app/tools/ffmpeg";
// const ytDlpPath = path.resolve(__dirname, "tools/yt-dlp.exe");
// const ffmpegPath = path.resolve(__dirname, "tools/ffmpeg.exe");
app.get("/reqMusic", async (req, res) => {
  const title = req.query.title;

  if (!title) {
    return res.status(404).json({ error: "title tidak boleh kosong" });
  }

  try {
    const searchResults = await ytsr(title, { limit: 1 });
    const video = searchResults.items.find((item) => item.type === "video");

    if (!video) {
      return res.status(404).json({ error: "Video tidak ditemukan." });
    }

    if (!video.id) {
      throw new Error("Tidak ada video yang cocok ditemukan.");
    }

    const audioDir = path.resolve(__dirname, "audios");
    const audioFilename = `${video.id}.mp3`;
    const audioPath = path.resolve(audioDir, audioFilename);

    await fsExtra.ensureDir(audioDir);
    await execCommand(
      `${ytDlpPath} --cookies-from-browser chrome --cookies cookies.txt -x --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${audioPath}" "https://www.youtube.com/watch?v=${video.id}"`
    );

    const data = fs.readFileSync(audioPath);
    const audioBase64 = data.toString("base64");

    res.send({
      audio: audioBase64,
      title: video.title,
      thumbnails: video.thumbnails[0].url,
    });
    fs.rmSync(audioPath);
  } catch (error) {
    console.error("Error saat menangani unduhan video:", error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengunduh video" });
  }
});

io.on("connection", (socket) => {
  let tiktokLiveConnection;
  console.log("a new client connected");

  socket.on("username", (data, options) => {
    socket.join(data.username);

    if (typeof options === "object" && options) {
      delete options.requestOptions;
      delete options.websocketOptions;
    } else {
      options = {};
    }

    if (data == "") return;
    try {
      tiktokLiveConnection = new TikTokConnectionWrapper(
        data.username,
        options,
        true,
        {
          requestConfig: {
            timeout: 30000,
          },
        }
      );
      tiktokLiveConnection.connect();
    } catch (error) {
      console.log(error);
    }
    if (tiktokLiveConnection) {
      setupTiktokEvents(io, data, tiktokLiveConnection);
    }
  });

  socket.on("callback", (data) => {
    isChatEnd(data);
  });

  socket.on("manualy-disconnect", (data) => {
    if (tiktokLiveConnection) {
      io.to(data).emit("tiktokConnection", "Disconectedd");
      tiktokLiveConnection.disconnect();
    }
  });
  socket.on("disconnect", () => {
    if (tiktokLiveConnection) {
      tiktokLiveConnection.disconnect();
    }
  });
});

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
