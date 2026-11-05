var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

// c.fillStyle = '#FF0000A0';
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = '#0000FFA0';
// c.fillRect(100, 205, 100, 100);
// c.fillStyle = '#00FF00A0';
// c.fillRect(205, 100, 100, 100);
// c.fillStyle = '#FFFF00A0';
// c.fillRect(205, 205, 100, 100);

// Line
// c.beginPath();
// c.lineWidth = 10;
// c.moveTo(50, 200);
// c.lineTo(200, 50);
// c.lineTo(450, 50);
// c.strokeStyle = 'green';
// c.stroke();
// c.closePath();

// Arc / Circle
// c.beginPath();
// c.arc(300, 300, 30, 0, Math.PI * 2, false);
// c.strokeStyle = 'blue';
// c.stroke();
// c.closePath();

// for(var i = 0; i < 1; i++) {
//   var red = Math.round(Math.random() * 255);
//   var green = Math.round(Math.random() * 255);
//   var blue = Math.round(Math.random() * 255);
//   var x = Math.random() * innerWidth;
//   var y = Math.random() * innerHeight;
//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2, false);
//   c.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
//   c.lineWidth = 5;
//   c.stroke();
//   c.closePath();
// }

class Circle {
  x;
  y;
  dx;
  dy;
  radius;
  red;
  green;
  blue;

  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius
    this.red = color[0];
    this.green = color[1];
    this.blue = color[2];
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.lineWidth = 5;
    c.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    c.fill();
    c.stroke();
    c.closePath();
  }

  update() {
    if (this.x + this.dx + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

// var x = Math.random() * innerWidth;
// var y = Math.random() * innerHeight;
// var dx = (Math.random() - 0.5) * 8;
// var dy = (Math.random() - 0.5) * 8;
// var radius = 30;

var circleArray = [];

for (var i = 0; i < 500; i++) {
  const r = Math.round((Math.random() + 1) * 30);
  const x = Math.round(Math.random() * (innerWidth - r * 2) + r);
  const y = Math.round(Math.random() * (innerHeight - r * 2) + r);
  const dx = Math.random() - 0.5 * -10 * Math.random() * 3;
  const dy = Math.random() - 0.5 * -10 * Math.random() * 3;

  const color = [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)];

  circleArray.push(new Circle(x, y, dx, dy, r, color));
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  circleArray.forEach((circle) => {
    circle.update();
  });
}

animate();