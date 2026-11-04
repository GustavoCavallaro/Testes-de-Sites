let moleTimeOutId;
let middleTimeOutId;
let endTimeOutId;
let moleHitInTimeOutId;
let moleGoOutTimeOutId;
let moleSpawnTimeOutId;
let moleGoHitInTimeOutId;

let whatVideo;
let whatImg;

let mole;
let img;

let score = JSON.parse(localStorage.getItem('score')) || 0;

const scoreParagraph = document.querySelector('.js-score');

scoreParagraph.innerHTML = `Score: ${score}`;

const hole = '../img/buraco-na-grama.jpg';
const moleGoOut = '../mp4/toupeira-saindo-do-buraco.mp4';
const moleGoIn = '../mp4/toupeira-sumindo.mp4';
const explosion = '../img/explosao.png';
const moleHitIn = '../mp4/toupeira-espancada-sumindo.mp4';

const startGameButton = document.querySelector('.js-start-game-button');
startGameButton.addEventListener('click', () => {
  startGame();
  startGameButton.style.display = 'none';
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

const spawnMole = () => {
  clearTimeout(moleTimeOutId);
  clearTimeout(endTimeOutId);

  updateScore();

  img.style.display = 'block';
  img.src = explosion;
  img.style.zIndex = 3;
  removeSpawnMoleEvent();
  moleHitInTimeOutId = setTimeout(() => {
    img.style.zIndex = 1;
    img.style.display = 'none';
    mole.src = moleHitIn;
  }, 500);
  middleTimeOutId = setTimeout(() => {
    startGame()
  }, 6000);
};

function startGame() {
  clearTimeout(moleTimeOutId);
  clearTimeout(middleTimeOutId);
  clearTimeout(endTimeOutId);
  clearTimeout(moleHitInTimeOutId);
  clearTimeout(moleGoOutTimeOutId);
  clearTimeout(moleSpawnTimeOutId);
  clearTimeout(moleGoHitInTimeOutId);

  decidePosition();

  moleGoOutTimeOutId = setTimeout( () => {
    mole.style.display = 'block';
    mole.src = moleGoOut;
  }, 1000);
  
  moleSpawnTimeOutId = setTimeout(() => {
    mole.style.cursor = 'pointer';
    mole.addEventListener('click', spawnMole)
  }, 1300);

  moleTimeOutId = setTimeout(() => {
    clearTimeout(middleTimeOutId);
    mole.src = moleGoIn;
  }, 6000);

  moleGoHitInTimeOutId = setTimeout(() => {
    removeSpawnMoleEvent();
  }, 8500);

  endTimeOutId = setTimeout(startGame, 15000);
}

function removeSpawnMoleEvent() {
  mole.style.cursor = 'default';
  mole.removeEventListener('click', spawnMole);
}

function updateScore() {
  score++;
  scoreParagraph.innerHTML = `Score: ${score}`;
  localStorage.setItem('score', JSON.stringify(score));
}

// let interval = 10000;
// let downInterval = 95;

// console.log(`${interval}`);

// function decreaseInterval() {
//   if (interval > 500) {
//     interval = (interval * downInterval) / 100;
//     downInterval -= 1;
//     console.log(interval);
//   }
//   else if (interval <= 500) {
//     interval = 500;
//     console.log(interval);
//   }

//   setTimeout(decreaseInterval, interval);
// }

// setTimeout(decreaseInterval, interval);

// const mainElement = document.querySelector('main');

// const hole = document.querySelector('.grass-hole');

// spawnMole();

// function spawnMole() {
//   setTimeout(() => {
//     hole.src = '../img/buraco-na-grama.jpg';
//     console.log('Spawn');
//     hole.addEventListener('click', (hole) => {
//       hole.src = 'img/explosao.png';
//       console.log('change!');
//     });
//   }, 1000);
//   setTimeout(() => {
//     hole.src = '../img/toupeira-no-gramado.jpg';
//     console.log('Dispawn');
//     hole.removeEventListener('click', (hole) => {
//       hole.src = 'img/explosao.png';
//       console.log('change!');
//     });
//   }, 2000);
  
//   setTimeout(spawnMole, 2000);
// }