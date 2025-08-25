// import { getGroqChatCompletion } from "../ai.js";
import { GroqAiChatCompletion } from "../aiConnection.js";
let userLastMessage = {};
let userLastTime = {};

export async function aiResponse(socket, pertanyaan, data) {
  if (pertanyaan === undefined) return;
  const { comment, user, img } = pertanyaan;
  const currentTime = new Date().getTime();
  if (userLastMessage[user] === comment) {
    socket
      .to(data.username)
      .emit("console", `Duplicate message for user:${user}`);
    return;
  }
  if (data.username === undefined) return;

  userLastMessage[user] = comment;
  userLastTime[user] = currentTime;

  try {
    let message = await new GroqAiChatCompletion(
      data.apikey,
      data.prompt,
      data.model,
      pertanyaan
    ).connect();
    if (message) {
      const result = {
        user,
        comment,
        img,
        prev: false,
        playOn: "ChatResponse",
        response: message.response,
        animation: message.animation,
      };
      socket.to(data.username).emit("chat response", result);
      socket.to(data.username).emit("console", JSON.stringify(result));
    }
  } catch (error) {
    throw error;
  }
}

let userLastMessageprev = {};

export async function aiPrevi(socket, pertanyaan) {
  const { comment, user } = pertanyaan;

  if (tiktokUsername === undefined) return;

  if (userLastMessageprev[user] === comment) {
    console.log(`Duplicate message for user:${user}`);
    return;
  }

  userLastMessageprev[user] = comment;

  try {
    let response;
    response = await getGroqChatCompletion(`${comment}`);
    const message = JSON.parse(response?.choices[0]?.message?.content);
    if (message) {
      const result = {
        user,
        comment,
        prev: true,
        playOn: "ChatResponse",
        response: message.response,
        animation: message.animation,
      };
      socket.emit("chat response", result);
    }
  } catch (error) {
    throw error;
  }
}
