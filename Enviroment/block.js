const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');

export class Block {
  w;
  h;
  pos;
  type;
  color;

  constructor(w, h, pos, type) {
    this.w = w;
    this.h = h;
    this.pos = pos;
    this.type = type;
  }

  draw() {
    this.loadAllColors();

    c.beginPath();
    c.rect(this.pos.x, this.pos.y, this.w + 1, this.h + 1);
    c.fillStyle = this.color[this.type];
    c.fill();
    c.closePath();
  }

  loadAllColors() {
    // const grass = c.createLinearGradient(
    //   this.pos.x,
    //   this.pos.y,
    //   this.pos.x,
    //   this.pos.y + this.h
    // );

    // grass.addColorStop(0, '#7CFC00');
    // grass.addColorStop(0.2, '#7CFC00');
    // grass.addColorStop(0.2, '#3D120A');
    // grass.addColorStop(1, '#3D120A');

    this.color = {
      grass: '#7CFC00',
      earth: '#3D120A',
      sand: '#F0DCA3',
      rock1: '#65645D',
      rock2: '#32312A',
      rock3: '#070707',
      water: '#001FD1',
      sky: '#DEEEFF'
    }
  }
}
