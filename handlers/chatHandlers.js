import { aiPrevi, aiResponse } from "../utils/aiResponse.js";
import { ChatEnd } from "../utils/isProcessing.js";

export async function handleCommand(socket, pertanyaan, data) {
  const room = data.username + socket.id;
  processQueue();
  function processQueue() {
    if (ChatEnd[room] === false) return;
    aiResponse(socket, pertanyaan, data);
  }
}

export function handleExpression(socket, dataUser, data) {
  socket.to(dataUser.username).emit("ekspresi", data);
}

export function handleFollow(socket, dataUser, data) {
  socket.to(dataUser.username).emit("follow", data);
  socket
    .to(dataUser.username)
    .emit("console", `User: ${data.uniqueId} Followed You!`);
}

export function handleGift(socket, dataUser, data) {
  socket.to(dataUser.username).emit("gift", data);
  socket
    .to(dataUser.username)
    .emit("console", `User: ${data.uniqueId}, gift ${data.giftName}!`);
}

export function handleMember(socket, dataUser, data) {
  socket
    .to(dataUser.username)
    .emit("joinChat", `Hallo ${data.uniqueId}, selamat datang!`);
  socket
    .to(dataUser.username)
    .emit("console", `User: ${data.uniqueId}, Joined!`);
}

export function handleShare(socket, dataUser, data) {
  socket.to(dataUser.username).emit("share", data);
  socket
    .to(dataUser.username)
    .emit("console", `User: ${data.uniqueId}, Shared Live!`);
}
