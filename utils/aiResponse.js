import { getGroqChatCompletion } from "../ai.js";

let userLastMessage = {};
let userLastTime = {};
let RATELIMIT = 5000;
export async function aiResponse(socket, pertanyaan) {
  if (pertanyaan === undefined) return;
  const { comment, user, roomUser } = pertanyaan;
  const currentTime = new Date().getTime();
  if (userLastMessage[user] === comment) {
    console.log(`Duplicate message for user:${user}`);
    return;
  }
  if (currentTime - userLastTime[user] === RATELIMIT) {
    console.log(`Rate Limit for user:${user}`);
    return;
  }
  if(roomUser === undefined) return

  userLastMessage[user] = comment;
  userLastTime[user] = currentTime;

  let response;
  response = await getGroqChatCompletion(`${comment}`);

  try {
     
    const message = JSON.parse(response?.choices[0]?.message?.content);
    if (message) {
      const result = {
        user,
        comment,
        prev: false,
        response: message.response,
        animation: message.animation,
      };
      socket.to(roomUser).emit("chat response", result);
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
}

let userLastMessageprev = {};

export async function aiPrevi(socket, pertanyaan) {
  const { comment, user } = pertanyaan;

  if(tiktokUsername === undefined) return

  if (userLastMessageprev[user] === comment) {
    console.log(`Duplicate message for user:${user}`);
    return;
  }

  userLastMessageprev[user] = comment;

  let response;

  response = await getGroqChatCompletion(`${comment}`);

  try {
    const message = JSON.parse(response?.choices[0]?.message?.content);
    if (message) {
      const result = {
        user,
        comment,
        prev: true,
        response: message.response,
        animation: message.animation,
      };
      socket.emit("chat response", result);
    }
  } catch (error) {
    console.log(error);
  }
}
