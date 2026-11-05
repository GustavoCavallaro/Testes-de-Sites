const img = document.querySelector('img');
let frameNumber = 0;
let framesInterval;
let isPlaying;

runAllFrames(24, 5.08);

function runAllFrames(fps, seconds) {
  const framesQuantity = Math.round(seconds * fps);
  const framesPerSecond = 1000 / fps;
  isPlaying = true;
  
  framesInterval = setInterval(() => {
    if (frameNumber >= framesQuantity) {
      frameNumber = 0;
    }
    frameNumber++;
    img.src = `../mp4/Frames-Toupeira-Transparente/frame_${toFrameFormat(frameNumber)}.png`;
  }, framesPerSecond);
}

addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    if (isPlaying) {
      clearInterval(framesInterval);
      isPlaying = false;
    }
    else {
      runAllFrames(24, 5.08);
    }
  }
});

function secondsToMilliseconds(seconds) {
  return seconds * 1000;
}

function toFrameFormat(frameNumber) {
  return String(frameNumber).padStart(4, '0');
}