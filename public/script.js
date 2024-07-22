const socket = io("http://localhost:3000");
let messageQueue = [].reverse();
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
setInterval(() => {
  messageQueue.sort((a, b) => b.prev - a.prev);
 },1000)
 
 function handleChatResponse(data) {
   prioritizeGift(data);
   if(data.prev){
     console.log('prev')
     handlegiftres(data)
   }else{
     setTimeout(() => {
       console.log('normal')
       handlegiftres(data)
     },1000)
   }
 }
 
 function handlegiftres (data) {
    if (!isSleep && data.response.length < 675) {
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

  let VideoSrc = "";
  let videoId = "";


  if (e.giftName === "Whale Diving") {
    VideoSrc = "video/donatKun.mp4";
    videoId = "video1";
    addTime(1800)
  }
  else if (e.giftName === "Doughnut") {
    VideoSrc = "video/donatKun.mp4";
    videoId = "video1";
    addTime(600)
  } else if (e.giftName === "Finger Heart") {
    VideoSrc = "video/FingerHeartKun.mp4";
    videoId = "video2";
    addTime(100)
  } else if (e.giftName === "Coffee") {
    VideoSrc = "video/CoffeeKun.mp4";
    videoId = "video3";
    addTime(20)
  } else if (e.giftName === "TikTok") {
    VideoSrc = "video/gaje.mp4";
    videoId = "video4";
  } else if (e.giftName === "Rose") {
    VideoSrc = "video/RoseKun.mp4";
    videoId = "video5";
    addTime(20)
  }

  // if (e.giftName === "Doughnut") {
  //   VideoSrc = "video/joget.mp4";
  //   videoId = "video1";
  // } else if (e.giftName === "Finger Heart") {
  //   VideoSrc = "video/ubur.mp4";
  //   videoId = "video2";
  // } else if (e.giftName === "Coffee") {
  //   VideoSrc = "video/lompat.mp4";
  //   videoId = "video3";
  // } else if (e.giftName === "TikTok") {
  //   VideoSrc = "video/gaje.mp4";
  //   videoId = "video4";
  // } else if (e.giftName === "Rose") {
  //   VideoSrc = "video/Tiktok.mp4";
  //   videoId = "video5";
  // }

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
//   arrgift.push({giftName:"Doughnut"})
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
    changeColor.style.background =  create3DGradient(warna);
    hand.forEach((e, index) => {
      hand[index].style.background = create3DGradient(warna);
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
  if (data.comment === "pilkun_ganteng") {
    emoji = "quiet";
    showEmoji("quiet");
  } else if (data.comment === "pilkun_jelek") {
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
        messageElement.innerHTML = ` `;
        chatDiv.classList.remove("border");
        chatDiv.classList.add("hidden");
        callback(); // Call the callback to indicate this message is done
      }, response.length >= 300? 11000 :7000);
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
    utterance.rate = 1.7;     
    utterance.volume = 1;      
    utterance.pitch = 1;    
    // Find a suitable female voice
    // const voices = speechSynthesis.getVoices();
    // const femaleVoice = voices.find(voice => voice.voiceURI === 'Microsoft Gadis Online (Natural) - Indonesian (Indonesia)');
    // utterance.voice = femaleVoice;


    utterance.onend = () => {
      console.log("Speech finished.");
      mouth.classList.remove("talking");
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
      timerElement.textContent = isEnd? 'Live is End Bye-Bye ':"Bangun: Share/gift";
      isSleep = true;
      showEmoji("sleep");
      return;
    }

    const minutesLeft = Math.floor(remainingTime / 60000);
    const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
   
    timerElement.textContent =`${isEnd?"Live End in:":"Tidur"} ${minutesLeft
      .toString()
      .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
  }, 1000);
}

function resetCountdown() {
  if(!isEnd){
    clearInterval(interval);
    isSleep = false;
    document.getElementById("timer").textContent = "Tidur 04:00";
    showEmoji(emoji);
    startCountdown();
  }
}

function getRandomColor() {
  const letters = '6789ABCD'; // Use only lighter colors
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function create3DGradient(color) {
  return `radial-gradient(circle at 50% 50%, 
          ${color} 0%, 
          ${shadeColor(color, -0.2)} 40%, 
          ${shadeColor(color, -0.4)} 70%, 
          ${shadeColor(color, -0.6)} 85%, 
          ${shadeColor(color, -0.8)} 100%)`;
}

function shadeColor(color, percent) {
  const num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent * 100),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

  return `#${(0x1000000 + 
              (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + 
              (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + 
              (B < 255 ? (B < 1 ? 0 : B) : 255)
             ).toString(16).slice(1).toUpperCase()}`;
}

setInterval(() => {
  if (isSleep) {
    showEmoji("sleep");
  }
}, 4000);

startCountdown();
showEmoji(emoji);




var typed = new Typed('.type', {
  strings: ["Tanya Apa Aja Ke pilkun", "Jangan Lupa Pake Tanda Tanya?"],
  backDelay: 700,
  typeSpeed: 50,
  loop:true,
  showCursor: false,
});


// timerEndLive

const timeLeftElement = document.getElementById('timerStream');
let timeLeft = localStorage.getItem('timeLeft') ? parseInt(localStorage.getItem('timeLeft')) : 0;
let intervall;

function updateTimeLeft() {
    if (timeLeft > 0) {
        timeLeft--;
        localStorage.setItem('timeLeft', timeLeft);
        timeLeftElement.textContent = formatTime(timeLeft);
    } else {
        clearInterval(intervall);
        document.getElementById('live-status').textContent = 'Live Ended';
    }
}

function formatTime(seconds) {
    const hours =  Math.floor(seconds / 60 / 60) ;
    const minutes = Math.floor(seconds / 60) % 60;
    const secs = seconds % 60;
    return `End Live: ${hours}:${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function startTimer() {
    if (timeLeft > 0) {
        intervall = setInterval(updateTimeLeft, 1000);
    } else {
        isEnd = true
    }
}

function addTime(seconds) {
    timeLeft += seconds;
    localStorage.setItem('timeLeft', timeLeft);
    if (!intervall) {
        startTimer();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    if (timeLeft > 0) {
        startTimer();
    } else {
        timeLeftElement.textContent = '0:00';
    }
});

function streamInterval(){
  clearInterval(intervall)
  timeLeft = 0
  timeLeftElement.innerHTML = "End Live: 0:00:00"
  localStorage.removeItem('timeLeft');
}
function initialTime(){
  localStorage.setItem('timeLeft', 7200);
  startTimer()
}

function showAddTime(){
  let bool = true
  const addTimer =  document.getElementById("addTimer")
  const displayTimer = document.getElementById("displayTimer")
  setInterval(() => {
    if(bool){
      displayTimer.style.display = ""
      addTimer.style.display = "none"
      setTimeout(() => {
        bool = false
      },3000)
    }else{
      displayTimer.style.display = "none"
      addTimer.style.display = ""
      setTimeout(() => {
        bool = true
      },3000)
    }
  },3000)
}

showAddTime()