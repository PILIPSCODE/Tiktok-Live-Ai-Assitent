import { handleCommand, handleExpression, handleFollow, handleGift, handleMember, handleShare } from "./chatHandlers.js";

export function setupTiktokEvents(io, tiktokLiveConnection) {
let pertanyaanQPrioritas = [{user:"pilkunwiay"}];

  tiktokLiveConnection.on("chat", (data) => {
    const comment = data.comment?.toLowerCase();
    const commands = ["!kodam", "!khodam", "?"];
    const expressions = [`${process.env.MODEL}_jelek`,`😭`,"😂","🥶",`${process.env.MODEL === "pilkun"?"pilkun_ganteng":"pilkia_cantik" }`];

    if (pertanyaanQPrioritas.some((e) => data.uniqueId.includes(e.user))) {
      handleCommand(io,data,"prioritas");
      console.log("prev")
      
    }else if (commands.some((cmd) => comment.includes(cmd))) {
      handleCommand(io,data,"normal");
      console.log("normal")
    }

    if (expressions.some((exp) => comment.includes(exp))) {
      handleExpression(io, data);
    }
   
  });


  tiktokLiveConnection.on("follow", (data) => handleFollow(io, data));
  tiktokLiveConnection.on("gift", (data) => {
    if (data.giftType === 1 && !data.repeatEnd) {
      handleGift(io, data)
      pertanyaanQPrioritas.push({user:data.uniqueId})
      console.log(data.giftName)
  } else{
      
  }
  });
  tiktokLiveConnection.on("member", (data) => handleMember(io, data));
  tiktokLiveConnection.on("share", (data) => handleShare(io, data));
}
