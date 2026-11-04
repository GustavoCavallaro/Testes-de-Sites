const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

var c = canvas.getContext('2d');

class Circle {
  keys = {
    w: false,
    a: false,
    s: false,
    d: false
  };
  
  x;
  y;
  r;
  speed;

  constructor(x, y, r, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = speed;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = 'blue';
    c.fill();
    c.lineWidth = 10;
    c.stroke();
    c.closePath();
  }

  update() {
    this.draw();
  }

  moveCircle() {
    if(this.keys.w) {
      this.y -= this.speed;
    }
    if(this.keys.a) {
      this.x -= this.speed;
    }
    if(this.keys.s) {
      this.y += this.speed;
    }
    if(this.keys.d) {
      this.x += this.speed;
    }
    // this.draw();
    setTimeout(() => {
      this.moveCircle();
    }, 20);
  }
}

const player = new Circle(200, 200, 50, 10);
player.draw();
player.moveCircle();

onkeydown = (event) => {
  console.log(event.key);
  if (event.key === 'w' || event.key === 'W' && !player.keys.w) {
    player.keys.w = true;
  }
  if (event.key === 'a' || event.key === 'A' && !player.keys.a) {
    player.keys.a = true;
  }
  if (event.key === 's' || event.key === 'S' && !player.keys.s) {
    player.keys.s = true;
  }
  if (event.key === 'd' || event.key === 'D' && !player.keys.d) {
    player.keys.d = true;
  }
};

onkeyup = (event) => {
  if (event.key === 'w' || event.key === 'W' && player.keys.w) {
    player.keys.w = false;
  }
  if (event.key === 'a' || event.key === 'A' && player.keys.a) {
    player.keys.a = false;
  }
  if (event.key === 's' || event.key === 'S' && player.keys.s) {
    player.keys.s = false;
  }
  if (event.key === 'd' || event.key === 'D' && player.keys.d) {
    player.keys.d = false;
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  player.update();
}

animate();