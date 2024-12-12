import {
  handleCommand,
  handleExpression,
  handleFollow,
  handleGift,
  handleMember,
  handleShare,
} from "./chatHandlers.js";

export function setupTiktokEvents(socket, dataUser, tiktokLiveConnection) {

  let pertanyaanQPrioritas = [{ user: "pilkunwiay" }];
  let pertanyaanQueue = [];
  let quietview = [ {
    "response": "Halo Halo Semuanya Selamat Datang ya, Jangan Lupa Follow, Tap Tap dan Share Ya",
    "animation": "Waving"
  },
    {
    "response": "Mau aku dance atau jawab pertanyaan bisa aja ya",
    "animation": "HipHopDancing2"
  }
]

  if(dataUser.username === "" || dataUser.username === undefined) return


  setInterval(() => {
    
    const pertanyaan = pertanyaanQueue.shift();
    handleCommand(socket, pertanyaan, dataUser);
  }, 5000);

  setInterval(() => {
    if(pertanyaanQueue.length === 0 ){
       const pertanyaan = quietview.shift();
      socket.to(dataUser.username).emit("chat response", pertanyaan);
    }
  },10000)

  tiktokLiveConnection.once('connected', state => socket.to(dataUser.username).emit('tiktokConnection', "Connected"));
  tiktokLiveConnection.once('disconnected', reason => socket.to(dataUser.username).emit('tiktokConnection', "Disconected"));

  tiktokLiveConnection.once('streamEnd', () => socket.to(dataUser.username).emit("tiktokConnection",'streamEnded'));

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

  tiktokLiveConnection.connection.on("follow", (data) => handleFollow(socket,dataUser, data));
  tiktokLiveConnection.connection.on("gift", (data) => {
    if (data.giftType === 1 && !data.repeatEnd) {
      handleGift(socket, username, data);
      pertanyaanQPrioritas.push({ user: data.uniqueId });
    } else {
    }
  });
  tiktokLiveConnection.connection.on("member", (data) => handleMember(socket,dataUser, data));
  tiktokLiveConnection.connection.on("share", (data) => handleShare(socket, dataUser, data));
}
