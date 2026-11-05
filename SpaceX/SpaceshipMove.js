  let playerPos = JSON.parse(localStorage.getItem('playerPos')) || [0, 0]; 
  let size = [356, 548];
  let speed = 8;
  let keys = {
    w: false,
    a: false,
    s: false,
    d: false
  };

  const spaceShip = document.querySelector('.spaceShip');

  spaceShip.style.width = `${size[0]}px`;
  spaceShip.style.height = `${size[1]}px`;
  spaceShip.style.translate = `${playerPos[0]}px ${playerPos[1]}px`;

  window.onkeydown = function (event) {
    turnKeysTrue();
  }

  window.onkeyup = function (event) {
    turnKeysFalse();
  }

  function turnKeysTrue () {
    if (event.key === 'w' && !keys.w) {
      keys.w = true;
    }
    if (event.key === 'a' && !keys.a) {
      keys.a = true;
    }
    if (event.key === 's' && !keys.s) {
      keys.s = true;
    }
    if (event.key === 'd' && !keys.d) {
      keys.d = true;
    }
  }

  function turnKeysFalse() {
    if (event.key === 'w' && keys.w) {
      keys.w = false;
    }
    if (event.key === 'a' && keys.a) {
      keys.a = false;
    }
    if (event.key === 's' && keys.s) {
      keys.s = false;
    }
    if (event.key === 'd' && keys.d) {
      keys.d = false;
    }
  }
  
  function moveSpaceShip () {
    if (keys.w) {
      if (playerPos[1] - speed < 0) {
      } else {
        playerPos[1] -= speed;
      }
    }
    if (keys.a) {
      if (playerPos[0] - speed < 0) {
      } else {
        playerPos[0] -= speed;
      }
    }
    if (keys.s) {
      if (playerPos[1] + speed + size[1] > innerHeight) {
        } else {
          playerPos[1] += speed;
        }
    }
    if (keys.d) {
      if (playerPos[0] + speed + size[0] > innerWidth) {
      } else {
        playerPos[0] += speed;
      }
    }
    
    spaceShip.style.translate = `${playerPos[0]}px ${playerPos[1]}px`;

    localStorage.setItem('playerPos', JSON.stringify(playerPos));
    
    setTimeout(moveSpaceShip, 16);
  }

  moveSpaceShip();