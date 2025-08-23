import {
  handleCommand,
  handleFollow,
  handleGift,
  handleMember,
  handleShare,
} from "./chatHandlers.js";

import { FrameCommentDetector } from "../utils/FramerDetector.js";
import { ChatEnd } from "../utils/isProcessing.js";

const frameCommentDetector = new FrameCommentDetector(2, 5, 5000, 5000);
frameCommentDetector.monitor();

let isProcessing = false;
export function setupTiktokEvents(socket, dataUser, tiktokLiveConnection) {
  let state = "quiet";
  if (dataUser.username === "" || dataUser.username === undefined) return;

  frameCommentDetector.on("stateChange", (newState, count) => {
    state = newState;
  });

  tiktokLiveConnection.once("connected", (state) =>
    socket.to(dataUser.username).emit("tiktokConnection", "Connected")
  );
  tiktokLiveConnection.once("disconnected", (reason) => {
    socket.to(dataUser.username).emit("tiktokConnection", reason);
  });

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
    if (data.comment.includes("")) {
      frameCommentDetector.addComment();
      if (!isProcessing && ChatEnd[dataUser.username] === true) {
        isProcessing = true;
        setTimeout(
          () => {
            handleCommand(socket, datas, dataUser);
            isProcessing = false;
          },
          state === "quiet" ? 0 : state === "middle" ? 1000 : 3000
        );
      }
    }

    socket.to(dataUser.username).emit("chat", data);
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
