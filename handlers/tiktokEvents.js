import { handleCommand, handleExpression, handleFollow, handleGift, handleMember, handleShare } from "./chatHandlers.js";

export function setupTiktokEvents(io, tiktokLiveConnection) {
  tiktokLiveConnection.on("chat", (data) => {
    const comment = data.comment?.toLowerCase();
    const commands = ["!kodam", "!khodam", "?"];
    const expressions = ["pilkia_jelek", "😭", "pilkia_cantik"];

    if (commands.some((cmd) => comment.includes(cmd))) {
      handleCommand(io,data);
    }

    if (expressions.some((exp) => comment.includes(exp))) {
      handleExpression(io, data);
    }
   
  });


  tiktokLiveConnection.on("follow", (data) => handleFollow(io, data));
  tiktokLiveConnection.on("gift", (data) => handleGift(io, data));
  tiktokLiveConnection.on("member", (data) => handleMember(io, data));
  tiktokLiveConnection.on("share", (data) => handleShare(io, data));
}
