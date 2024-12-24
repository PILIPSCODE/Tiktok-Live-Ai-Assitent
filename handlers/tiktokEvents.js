import {
  handleCommand,
  handleExpression,
  handleFollow,
  handleGift,
  handleMember,
  handleShare,
} from "./chatHandlers.js";

import { ChatEnd } from "../utils/isProcessing.js";

export function setupTiktokEvents(socket, dataUser, tiktokLiveConnection) {
  let pertanyaanQPrioritas = [{ user: "pilkunwiay" }];
  let pertanyaanQueue = [];

  if (dataUser.username === "" || dataUser.username === undefined) return;

  setInterval(() => {
    if (ChatEnd !== true) return;
    const pertanyaan = pertanyaanQueue.reverse().shift();
    handleCommand(socket, pertanyaan, dataUser);
  }, 3000);

  setInterval(() => {
    pertanyaanQueue = [];
  }, 60000);

  tiktokLiveConnection.once("connected", (state) =>
    socket.to(dataUser.username).emit("tiktokConnection", "Connected")
  );
  tiktokLiveConnection.once("disconnected", (reason) =>
    socket.to(dataUser.username).emit("tiktokConnection", "Disconected")
  );

  tiktokLiveConnection.once("streamEnd", () =>
    socket.to(dataUser.username).emit("tiktokConnection", "streamEnded")
  );

  tiktokLiveConnection.connection.on("chat", (data) => {
    const datas = {
      comment: data.comment,
      user: data.nickname,
      prev: false,
      uniqueId: data.uniqueId,
    };
    const comment = data.comment?.toLowerCase();
    const commands = [""];

    // if (pertanyaanQPrioritas.some((e) => data.uniqueId.includes(e.user))) {
    //   handleCommand(socket, data, "prioritas");
    // } else if (commands.some((cmd) => comment.includes(cmd))) {
    if (pertanyaanQueue.length <= 10) {
      pertanyaanQueue.push(datas);
    }
    // }
  });

  tiktokLiveConnection.connection.on("follow", (data) =>
    handleFollow(socket, dataUser, data)
  );
  tiktokLiveConnection.connection.on("gift", (data) => {
    if (data.giftType === 1 && !data.repeatEnd) {
      handleGift(socket, dataUser, data);
    } else {
    }
  });
  tiktokLiveConnection.connection.on("member", (data) =>
    handleMember(socket, dataUser, data)
  );
  tiktokLiveConnection.connection.on("share", (data) =>
    handleShare(socket, dataUser, data)
  );
}
