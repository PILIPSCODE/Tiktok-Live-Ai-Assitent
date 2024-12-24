// import { EventEmitter } from "events";
// import fs from "fs";
// import { fileURLToPath } from 'url';
// import { execCommand } from "./utils/exectCommand.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const ffmpegPath = path.resolve(__dirname, 'tools', 'ffmpeg.exe');
// const ytDlpPath = path.resolve(__dirname, 'tools', 'yt-dlp.exe');

// class GroqAiChatCompletion extends EventEmitter {
//   constructor(title) {
//     super();
//     this.title = title;
//   }

//   async request() {
//     try {
//       const searchResults = await ytsr(this.title, { limit: 1 });
//       const video = searchResults.items.find((item) => item.type === "video");

//       if (!video) {
//         return res.status(404).json({ error: "Video tidak ditemukan." });
//       }

//       if (!video.id) {
//         throw new Error("Tidak ada video yang cocok ditemukan.");
//       }

//       const audioDir = path.resolve(__dirname, "audios");
//       const audioFilename = `${video.id}.mp3`;
//       const audioPath = path.resolve(audioDir, audioFilename);

//       await fsExtra.ensureDir(audioDir);
//       await execCommand(
//         `${ytDlpPath} -x --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${audioPath}" "https://www.youtube.com/watch?v=${video.id}"`
//       );

//       const data = fs.readFileSync(audioPath);
//       const audioBase64 = data.toString("base64");

//       return audioBase64
      
//     } catch (error) {
//       console.error("Error saat menangani unduhan video:", error);
//     //   return res
//     //     .status(500)
//     //     .json({ error: "Terjadi kesalahan saat mengunduh video" });
//     // }
//   }
// }

// export { GroqAiChatCompletion };
