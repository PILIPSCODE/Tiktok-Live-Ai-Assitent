// import { getGroqChatCompletion } from "../ai.js";
import { GroqAiChatCompletion } from "../aiConnection.js";
let userLastMessage = {};
let userLastTime = {};
let RATELIMIT = 5000;

export async function aiResponse(socket, pertanyaan,data) {
  if (pertanyaan === undefined) return;
  const { comment, user} = pertanyaan;
  const currentTime = new Date().getTime();
  if (userLastMessage[user] === comment) {
    socket.to(data.username).emit("console",`Duplicate message for user:${user}`);
    return;
  }
  if (currentTime - userLastTime[user] === RATELIMIT) {
     socket.to(data.username).emit("console",`Rate Limit for user:${user}`);
    return;
  }
  if(data.username === undefined) return

  userLastMessage[user] = comment;
  userLastTime[user] = currentTime;

  let message = await new GroqAiChatCompletion(data.apikey,data.prompt,data.model,pertanyaan).connect()

  try {
     
    if (message) {
      const result = {
        user,
        comment,
        prev: false,
        response: message.response,
        animation: message.animation,
      };
      socket.to(data.username).emit("chat response", result);
      socket.to(data.username).emit("console",JSON.stringify(result));
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
