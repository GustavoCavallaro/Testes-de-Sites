let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#C9B7FF";

class Circle {
  constructor (x, y, r, color, text, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.text = text;
    this.speed = speed;

    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }

  draw(context) {
    context.beginPath();

    this.text = hit_counter;

    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.x, this.y);

    context.strokeStyle = this.color;
    context.lineWidth = 5;
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update() {
    this.draw(context);

    this.x += this.dx;
    this.y += this.dy;
  }
}

let hit_counter = 1;
let randomX = Math.random() * window_width;
let randomY = Math.random() * window_height;

let my_circle1 = new Circle(100, 100, 50, "black", hit_counter, 10)
let my_circle2 = new Circle(100, 100, 50, "black", hit_counter, 10)

my_circle1.draw(context);
my_circle2.draw(context);

let updateCircle = function () {

  if (my_circle.x + my_circle.r >= window_width) {
    my_circle.dx = -Math.abs(my_circle.dx);
    hit_counter++;
  }
  
  if (my_circle.x - my_circle.r < 0) {
    my_circle.dx = Math.abs(my_circle.dx);
    hit_counter++;
  }
  
  if (my_circle.y + my_circle.r >= window_height) {
    my_circle.dy = -Math.abs(my_circle.dy);
    hit_counter++;
  }
  
  if (my_circle.y - my_circle.r < 0) {
    my_circle.dy = Math.abs(my_circle.dy);
    hit_counter++;
  }

  requestAnimationFrame(updateCircle);
  context.clearRect(0, 0, window_width, window_height);
  my_circle1.update();
  my_circle2.update();
}

updateCircle();