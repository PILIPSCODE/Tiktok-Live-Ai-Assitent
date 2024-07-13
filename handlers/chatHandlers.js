import { aiResponse } from "../utils/aiResponse.js";

let pertanyaanQueue = [];
let pertanyaanQPrioritas = [];

export function handleCommand(io,data) {
  const datas = {
    comment: data.comment,
    user: data.nickname,
    prev: false,
    uniqueId: data.uniqueId,
  };

  if (pertanyaanQPrioritas.some((e) => datas.uniqueId.includes(e.user))) {
    const pertanyaan = { prev: true, comment: data.comment, uniqueId: data.uniqueId, user: data.nickname };
    aiResponse(io,pertanyaan);
  } else {
    pertanyaanQueue.push(datas);
  }

  setInterval(() => {
    if (pertanyaanQueue.length > 0) {
      const pertanyaan = pertanyaanQueue.shift();
      aiResponse(io,pertanyaan);
    }
  }, 2500);
}

export function handleExpression(io, data) {
  io.emit("ekspresi", data);
}

export function handleFollow(io, data) {
  io.emit("follow", data.uniqueId);
}

export function handleGift(io, data) {
  pertanyaanQPrioritas.push(data);
  io.emit("gift", data);
}

export function handleMember(io, data) {
  io.emit("join", `Hallo ${data.uniqueId}, selamat datang!`);
}

export function handleShare(io, data) {
  io.emit("share", `Hallo ${data.uniqueId}, selamat datang!`);
}

setInterval(() => {
  pertanyaanQueue = [];
}, 10000);
