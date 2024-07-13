const socket = io("http://localhost:3000");
let messageQueue = [].reverse();
let userPrioritas = [{ user: "until_i_can" }];
let emoji = "quiet";
let isProcessing = false;
let isSleep = false;
const handRight = document.querySelector(".hand-right");
const mouth = document.querySelector(".mouth-shape");

socket.on("connection", handleConnection);
socket.on("chat response", handleChatResponse);
socket.on("gift", handleGift);
socket.on("share", handleShare);
socket.on("follow", handleFollow);
socket.on("join", handleJoin);
socket.on("ekspresi", handleEkspresi);
socket.on("music", handlePlayMusic);
socket.on("disconnect", handleDisconnect);

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
}); // Memisahkan kode yang berkaitan dengan socket.io ke dalam fungsi terpisah

setInterval(() => {
  messageQueue = [];
}, 20000);

function handleConnection() {
  console.log(`socket with id ${socket.id} connect server`);
}

function handleChatResponse(data) {
  prioritizeGift(data);

  if (!isSleep) {
    messageQueue.push(data);
    processQueue();
    chatDiv.classList.remove("hidden");
  } else {
    messageQueue = [];
    showEmoji("sleep");
    chatDiv.classList.add("hidden");
  }
}

let arrgift = [];
async function handleGift(data) {
  resetCountdown();
  Toast.fire({
    title: `@${data.uniqueId} Terima Kasih Gift ${data.giftName}nya ❤️❤️❤️`,
  });
  userPrioritas.push({ user: data.uniqueId });

  await arrgift.push(data)
  handleVideoGift(data)
}

function handleShare(data) {
  if (data) {
    resetCountdown();
  }
}


function handlePlayMusic(data){
  const music = document.querySelector("#music")
  const audio = document.querySelector("#audioPlayer")
  const logomusic = document.querySelector("#logomusic")
  if(data !== ""){
    music.innerHTML = data.title
    logomusic.classList.add("AnimRotate")
    audio.src = data.url
    audio.play()
    console.log(data.url)
  }else{
    audio.src = ""
    music.innerHTML = "no music is playing now"
    logomusic.classList.remove("AnimRotate")
  }
}


let played = false;

async function handleVideoGift() {
  if (played || arrgift.length === 0) return;
  played = true;
  const e = arrgift.shift(); // Process one gift at a time
  const vid = document.querySelector(".vid");

  let videoSrc = "";
  let videoId = "";

  if (e.giftName === "Doughnut") {
    videoSrc = "joget.mp4";
    videoId = "video1";
  } else if (e.giftName === "Finger Heart") {
    videoSrc = "ubur.mp4";
    videoId = "video2";
  } else if (e.giftName === "Coffee") {
    videoSrc = "lompat.mp4";
    videoId = "video3";
  } else if (e.giftName === "TikTok") {
    videoSrc = "gaje.mp4";
    videoId = "video4";
  } else if (e.giftName === "Rose") {
    videoSrc = "Tiktok.mp4";
    videoId = "video5";
  }

  if (videoSrc) {
    const videoElement = await createVideoElement(videoSrc, videoId);
    vid.appendChild(videoElement);

    videoElement.addEventListener("ended", () => {
      vid.innerHTML = "";
      played = false;
      handleVideoGift(); // Process the next gift
    });
  } else {
    played = false; 
  }
}

// setTimeout(() => {
//   arrgift.push({giftName:"TikTok"})
//   handleVideoGift()
// },4000)


function createVideoElement(src, id) {
  return new Promise((resolve) => {
    const videoElement = document.createElement("video");
    videoElement.id = id;
    videoElement.autoplay = true;
    videoElement.muted = false;

    const sourceElement = document.createElement("source");
    sourceElement.src = src;
    sourceElement.type = "video/mp4";

    videoElement.appendChild(sourceElement);
    resolve(videoElement);
  });
}



async function handleFollow(data) {
  if (data) {
    const changeColor = document.querySelector(".emoji-container");
    const hand = document.querySelectorAll(".hand");
    let warna = getRandomColor();
    changeColor.style.backgroundColor = warna;
    hand.forEach((e, index) => {
      hand[index].style.backgroundColor = warna;
    });
    Toast.fire({
      title: `@${data} Terima Kasih Telah Mengikuti ❤️❤️❤️`,
    });
  }
}

async function handleJoin(data) {
  if (!isSleep) {
    handRight.classList.add("wave");
    btn.textContent = "Melambai";
  }
}

function handleEkspresi(data) {
  console.log(data);
  if (data.comment === "pilkia_cantik") {
    emoji = "quiet";
    showEmoji("quiet");
  } else if (data.comment === "pilkia_jelek") {
    emoji = "angry";
    showEmoji("angry");
  } else {
    emoji = "cry";
    showEmoji("cry");
  }
}

function handleDisconnect() {
  console.log("disconnected from server");
}

setInterval(() => {
  handRight.classList.remove("wave");
}, 5000);

async function prioritizeGift(data) {
  userPrioritas.forEach((e) => {
    if (e.user === data.user) {
      messageQueue.unshift(data);
    }
  });
}

function processQueue() {
  if (isProcessing || messageQueue.length === 0) {
    return;
  }

  isProcessing = true;
  const data = messageQueue.shift();
  const chatDiv = document.getElementById("chat");
  displayMessage(chatDiv, data.user, data.comment, data.response, () => {
    isProcessing = false;
    processQueue();
  });
}

async function displayMessage(chatDiv, user, comment, response, callback) {
  const messageElement = document.createElement("div");
  chatDiv.appendChild(messageElement);

  let i = 0;
  const typingSpeed = 1.3; // Speed of "typing" effect in ms

  function typeWriterComment() {
    chatDiv.classList.add("border");
    chatDiv.classList.remove("hidden");
    if (i < comment.length) {
      messageElement.innerHTML = `<strong class="oke">${user}</strong>: ${comment.substring(
        0,
        i + 1
      )}`;
      i++;
      setTimeout(typeWriterComment, typingSpeed);
    } else {
      setTimeout(typeWriterResponse, 1000); // Delay before showing response
    }
  }

  let j = 0;
  await speak(response, comment);
  function typeWriterResponse() {
    showEmoji(emoji);
    btn.textContent = "Berbicara";

    mouth.classList.add("talking");
    if (j === 0) {
      messageElement.innerHTML += `<br class="mt-3"><strong>pilkia</strong>: Hallo ${user} `;
    }
    if (j < response.length) {
      messageElement.innerHTML += response.charAt(j);
      j++;
      setTimeout(typeWriterResponse, typingSpeed + 20);
    } else {
      setTimeout(() => {
        showEmoji(emoji);
        mouth.classList.remove("talking");
        messageElement.innerHTML = ` `;
        chatDiv.classList.remove("border");
        chatDiv.classList.add("hidden");
        callback(); // Call the callback to indicate this message is done
      }, response.length >= 300? 9000 :5000);
    }
  }

  typeWriterComment();
}

      
function speak(response) {
  function filterEmojis(text) {
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|[\u2600-\u27BF]/g;
    return text.replace(emojiRegex, '');
  }

  // Filter emojis from the response
  const cleanResponse = filterEmojis(response);
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(cleanResponse);
    
    utterance.lang = "id-ID";  
    utterance.rate = 1.4;     
    utterance.volume = 1;      
    utterance.pitch = 1;    
    // Find a suitable female voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.voiceURI === 'Microsoft Gadis Online (Natural) - Indonesian (Indonesia)');
    utterance.voice = femaleVoice;


    utterance.onend = () => {
      console.log("Speech finished.");
    };

    speechSynthesis.speak(utterance);
    resolve();

  });
}


function showEmoji(type) {
  const btn = document.querySelector("#btn");
  const emoji1 = document.getElementById("emoji1");

  // Reset classes
  emoji1.classList.remove(
    "sleeping",
    "talking",
    "quiet",
    "waving",
    "angry",
    "cry"
  );

  // Hide all emojis initially

  // Show and add the corresponding class to the emoji based on the type
  if (type === "sleep") {
    emoji1.classList.add("sleeping");
    emoji1.style.display = "flex";
    btn.textContent = "Tidur";
  } else if (type === "talk") {
    emoji1.classList.add("talking");
    emoji1.style.display = "flex";
    btn.textContent = "Berbicara";
  } else if (type === "quiet") {
    emoji1.classList.add("quiet");
    emoji1.style.display = "flex";
    btn.textContent = "Diam";
  } else if (type === "wave") {
    handRight.classList.add("wave");
    btn.textContent = "Melambai";
  } else if (type === "angry") {
    emoji1.classList.add("angry");
    emoji1.style.display = "flex";
    btn.textContent = "Jutek";
  } else if (type === "cry") {
    emoji1.classList.add("cry");
    emoji1.style.display = "flex";
    btn.textContent = "Sedih";
  }
}

let isEnd = false;
let interval;
const initialMinutes = isEnd?0:4 ;

function startCountdown() {
  clearInterval(interval);
  const endTime = new Date().getTime() + initialMinutes * 60000;
  const timerElement = document.getElementById("timer");

  interval = setInterval(() => {
    const currentTime = new Date().getTime();
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
      clearInterval(interval);
      timerElement.textContent = isEnd? 'Live telah selesai babay semua':"Share/gift untuk membangunkan";
      isSleep = true;
      showEmoji("sleep");
      return;
    }

    const minutesLeft = Math.floor(remainingTime / 60000);
    const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
   
    timerElement.textContent =`${isEnd?"Live End in:":"Tidur:"} ${minutesLeft
      .toString()
      .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
  }, 1000);
}

function resetCountdown() {
  if(!isEnd){
    clearInterval(interval);
    isSleep = false;
    document.getElementById("timer").textContent = "04:00";
    showEmoji(emoji);
    startCountdown();
  }
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}
function getShowVideo() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

setInterval(() => {
  if (isSleep) {
    showEmoji("sleep");
  }
}, 4000);

startCountdown();
showEmoji(emoji);




