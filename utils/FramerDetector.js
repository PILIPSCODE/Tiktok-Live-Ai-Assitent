import { EventEmitter } from "events";

class FrameCommentDetector extends EventEmitter {
  constructor(quietThreshold, middleThreshold, interval, frameDuration) {
    super();
    this.quietThreshold = quietThreshold;
    this.middleThreshold = middleThreshold;
    this.interval = interval;
    this.frameDuration = frameDuration;
    this.comments = [];
    this.currentState = "quiet";
  }

  addComment(comment) {
    const now = Date.now();
    this.comments.push(now);
  }

  monitor() {
    setInterval(() => {
      const now = Date.now();
      // Remove outdated comments
      this.comments = this.comments.filter(
        (timestamp) => now - timestamp <= this.interval
      );

      // Determine the new state
      let newState;
      const commentCount = this.comments.length;

      if (commentCount < this.quietThreshold) {
        newState = "quiet";
      } else if (commentCount <= this.middleThreshold) {
        newState = "middle";
      } else {
        newState = "active";
      }
      this.emit("stateChange", this.currentState, commentCount);
      this.currentState = newState;
      this.comments = [];
    }, this.frameDuration);
  }
}

export { FrameCommentDetector };
