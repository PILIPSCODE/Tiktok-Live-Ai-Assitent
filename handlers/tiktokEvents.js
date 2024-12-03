import {
  handleCommand,
  handleExpression,
  handleFollow,
  handleGift,
  handleMember,
  handleShare,
} from "./chatHandlers.js";

export function setupTiktokEvents(socket, username, tiktokLiveConnection) {

  let pertanyaanQPrioritas = [{ user: "pilkunwiay" }];
  let pertanyaanQueue = [];

  if(username === "" || username === undefined) return


  setInterval(() => {
    const pertanyaan = pertanyaanQueue.shift();
    handleCommand(socket, pertanyaan, "normal");
  }, 5000);
  tiktokLiveConnection.once('connected', state => socket.to(username).emit('tiktokConnection', "Connected"));
  tiktokLiveConnection.once('disconnected', reason => socket.to(username).emit('tiktokConnection', "Disconected"));

  tiktokLiveConnection.once('streamEnd', () => socket.to(username).emit("tiktokConnection",'streamEnded'));

  tiktokLiveConnection.connection.on("chat", (data) => {
    const datas = {
      roomUser:username,
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

  tiktokLiveConnection.connection.on("follow", (data) => handleFollow(socket,username, data));
  tiktokLiveConnection.connection.on("gift", (data) => {
    if (data.giftType === 1 && !data.repeatEnd) {
      handleGift(socket, username, data);
      pertanyaanQPrioritas.push({ user: data.uniqueId });
    } else {
    }
  });
  tiktokLiveConnection.connection.on("member", (data) => handleMember(socket,username, data));
  tiktokLiveConnection.connection.on("share", (data) => handleShare(socket, username, data));
}
