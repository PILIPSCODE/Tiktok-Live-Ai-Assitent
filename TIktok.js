import { WebcastPushConnection } from "tiktok-live-connector";

let tiktokUsername ="xudofinanda";
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername, {
  requestConfig: {
    timeout: 30000, // Increase timeout to 30 seconds
  },
});

// Function to connect with retry handling
function connectWithRetry(retryCount = 0) {
  tiktokLiveConnection
    .connect()
    .then((state) => {
      console.info(`Connected to roomId ${state.roomId}`);
    })
    .catch((err) => {
      console.error("Failed to connect", err);
      if (retryCount < 3) {
        // Retry up to 3 times
        console.log(`Retrying connection... Attempt ${retryCount + 1}`);
        connectWithRetry(retryCount + 1);
      }
    });
}


export { connectWithRetry, tiktokLiveConnection};
