import { aiPrevi, aiResponse } from "../utils/aiResponse.js";
import { ChatEnd } from "../utils/isProcessing.js";




export async function handleCommand(socket,pertanyaan) {


  processQueue()
  
  async function processQueue() {
    console.log("this is chat end",ChatEnd)
    if (ChatEnd === false ) return;
      aiResponse(socket, pertanyaan);

  }
}

export function handleExpression(socket, username,data) {
  socket.to(username).emit("ekspresi", data);
}

export function handleFollow(socket, username,data) {
  socket.to(username).emit("follow", data);
}

export function handleGift(socket, username,data) {
  socket.to(username).emit("gift", data);
}

export function handleMember(socket, username,data) {
  socket.to(username).emit("joinChat", `Hallo ${data.uniqueId}, selamat datang!`);
}

export function handleShare(socket,username,data){ 
  socket.to(username).emit("share",data);
}

