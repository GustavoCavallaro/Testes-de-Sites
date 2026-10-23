let moleTimeOutId;
let middleTimeOutId;
let endTimeOutId;
let moleHitInTimeOutId;
let moleGoOutTimeOutId;
let moleSpawnTimeOutId;
let moleGoHitInTimeOutId;
let moleMinus1;

let whatVideo;
let whatImg;

let isStarted;

let mole;
let img;

function changeSpeed() {
  document.querySelectorAll('video').forEach(video => {
    videoSpeed = (score > 15)? 15 : (score === 0)? 1 : score;
    video.addEventListener('loadedmetadata', () => {
      video.playbackRate = videoSpeed; 
    });
  });
}

let score = JSON.parse(localStorage.getItem('score')) || 10000;

let videoSpeed = 0;

changeSpeed();

const scoreParagraph = document.querySelector('.js-score');

scoreParagraph.innerHTML = `Score: ${score}`;

const hole = '../img/buraco-na-grama.jpg';
const moleGoOut = '../mp4/Toupeira-Saindo-Do-Buraco.webm';
const moleGoIn = '../mp4/Toupeira-Sumindo.webm';
const martelada = 'http://127.0.0.1:5500/img/martelada.png';
const moleHitIn = '../mp4/Toupeira-Espancada-Sumindo.mp4';

const startGameButton = document.querySelector('.js-start-game-button');
const startGameImg = document.querySelector('.js-start-game-icon');

function changePlayButtonStatus() {
  if (startGameImg.src === 'http://127.0.0.1:5500/img/play%20icon.png') {
      startGame();
      startGameImg.src = 'http://127.0.0.1:5500/img/pause%20icon.png';
      startGameImg.classList.remove('looping');
    } 
    else {
      startGameImg.src = `http://127.0.0.1:5500/img/loading%20icon.png`
      startGameImg.classList.add('looping');
      isStarted = true;
    }
}

addEventListener('keydown', event => {
  if (event.key === ' ') {
    changePlayButtonStatus();
  }
});

startGameButton.addEventListener('click', () => {
  changePlayButtonStatus();
});

function decidePosition() {
  const randomNumber = Math.random();

  if (randomNumber < 1 / 4) {
    whatVideo = 'v1';
    whatImg = 'img1';
  }
  else if (randomNumber < 2 / 4) {
    whatVideo = 'v2';
    whatImg = 'img2';
  }
  else if (randomNumber < 3 / 4) {
    whatVideo = 'v3';
    whatImg = 'img3';
  }
  else {
    whatVideo = 'v4';
    whatImg = 'img4';
  }

  mole = document.querySelector(`.${whatVideo}`);
  img = document.querySelector(`.${whatImg}`);
}

function startGame() {
  if (isStarted) {
    isStarted = false;
    startGameImg.src = 'http://127.0.0.1:5500/img/play%20icon.png';
    startGameImg.classList.remove('looping');

    clearAllTimeOut();

    removeSpawnMoleEvent();
    localStorage.setItem('score', JSON.stringify(score));
    mole.onclick = null;
    return;
  }

  clearAllTimeOut();
  decidePosition();
  moleGoOutOfTheHole(mole, img);
  moleEnterInTheHole(mole);

  moleGoHitInTimeOutId = setTimeout(() => {
    removeSpawnMoleEvent();
  }, 9500 / videoSpeed);

  endTimeOutId = setTimeout(startGame, 10000 / videoSpeed);
}

function removeSpawnMoleEvent() {
  mole.style.cursor = 'default';
  mole.style.zIndex = 2;
}

function updateScore() {
  score++;
  scoreParagraph.innerHTML = `Score: ${score}`;
  changeSpeed();
}

document.querySelector('.js-reset-score-button')
  .addEventListener('click', resetScore);

function resetScore() {
  score = 0;
  scoreParagraph.innerHTML = `Score: ${score}`;
  localStorage.removeItem('score');
  changeSpeed();
}

function decreaseSpeed() {
  if (!score - 1 < 0) {
    score--;
    scoreParagraph.innerHTML = `Score ${score}`;
    document.querySelector('.js-minus1').classList.add('anim-score');
    setTimeout(() => {
      if (document.querySelector('.js-minus1')
          .classList.contains('anim-score')) {
        document.querySelector('.js-minus1').classList.remove('anim-score');
      }
    }, 500);
    localStorage.setItem('score', JSON.stringify(score));
    changeSpeed();
  }
}

function clearAllTimeOut() {
  clearTimeout(moleTimeOutId);
  clearTimeout(middleTimeOutId);
  clearTimeout(endTimeOutId);
  clearTimeout(moleMinus1);
  clearTimeout(moleHitInTimeOutId);
  clearTimeout(moleGoOutTimeOutId);
  clearTimeout(moleSpawnTimeOutId);
  clearTimeout(moleGoHitInTimeOutId);
}

function moleGoOutOfTheHole(mole, img) {
  moleGoOutTimeOutId = setTimeout( () => {
    mole.style.display = 'block';
    mole.src = moleGoOut;
  }, 1000 / videoSpeed);

  moleSpawnTimeOutId = setTimeout(() => {
    mole.style.cursor = 'pointer';
    mole.style.zIndex = 3;
    mole.onclick = () => hitMole(mole, img);
  }, 1300 / videoSpeed);
}

function moleEnterInTheHole(mole) {
  moleTimeOutId = setTimeout(() => {
    clearTimeout(middleTimeOutId);
    mole.src = moleGoIn;
  }, 6000 / videoSpeed);

  moleMinus1 = setTimeout(() => {
    decreaseSpeed();
  }, 9500 / videoSpeed);
}

function hitMole(mole, img) {
  clearTimeout(moleTimeOutId);
  clearTimeout(endTimeOutId);
  clearTimeout(moleMinus1);

  console.log(JSON.parse(localStorage.getItem('score')));

  updateScore();

  mole.style.display = 'none';
  img.style.display = 'block';
  img.src = martelada;
  img.style.zIndex = 4;
  removeSpawnMoleEvent();
  moleHitInTimeOutId = setTimeout(() => {
    img.style.zIndex = 2;
    mole.style.display = 'block';
    img.style.display = 'none';
    mole.src = moleHitIn;
  }, 500 / videoSpeed);
  middleTimeOutId = setTimeout(() => {
    startGame()
  }, 6000 / videoSpeed);
};