import { getGroqChatCompletion, getKhodam } from "../ai.js";

let userLastMessage = {};
let userLastTime = {};
export async function aiResponse(io,pertanyaan) {
  const { comment, user } = pertanyaan;
  const currentTime = new Date().getTime();

  
  if (userLastMessage[user] === comment) {
    console.log(`Duplicate message for user:${user}`);
    return;
  }

  userLastMessage[user] = comment;
  userLastTime[user] = currentTime;
  setInterval(() =>{userLastMessage=[],userLastTime=[]},120000)

  let response;
  if (["!kodam", "!khodam"].some((cmd) => comment.includes(cmd))) {
    response = await getKhodam(`expresi:normal comment:${comment} + user:${user}`);
  } else if (comment.includes("?")) {
    response = await getGroqChatCompletion(`${comment} + user:${user}`);
  }

  if (response) {
    const result = {
      user,
      comment,
      response: response?.choices[0]?.message?.content,
    };
    console.log(result);
    io.emit("chat response", result);
  }
}
