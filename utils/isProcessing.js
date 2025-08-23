const ChatEnd = {};

function isChatEnd(data, room) {
  ChatEnd[room] = data;
}

export { isChatEnd, ChatEnd };
