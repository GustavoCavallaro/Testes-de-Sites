import {Block} from './block.js';

export class Scene {
  allBlocks = [];
  rows;
  columns;
  blockWidth;
  blockHeight;

  seed = Math.floor(Math.random() * 1000 * (Math.random() * 30));

  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.blockWidth = innerWidth / columns;
    this.blockHeight = innerHeight / rows;
  }

  draw() {

  }

  renderScene() {
    this.generateBlock();
    this.drawScene();
  }

  generateBlock() {
    for(let y = 0; y < this.rows; y++) {
      for(let x = 0; x < this.columns; x++) {
        const pos = {
          x: this.blockWidth * x,
          y: this.blockHeight * y,
          rowIndex: y,
          columnIndex: x
        };
        this.allBlocks.push(new Block(this.blockWidth, this.blockHeight, pos));
      }
    }
  }

  drawScene() {
    const delay = 10;
    const seaLevel = Math.floor(this.rows * 0.55);

    this.allBlocks.forEach(block => {
      const terrainHeight = this.getIndex(block.pos.columnIndex, this.seed);
      block.type = this.sayBlockType(block, terrainHeight, seaLevel);
      // setTimeout(() => {
      //   block.draw();
      // }, delay)
      block.draw();
    });
  }
  
  sayBlockType(block, terrainHeight, seaLevel) {
    const y = block.pos.rowIndex;

    // Espaço acima do terreno
    if (y < terrainHeight) {
      if (y >= seaLevel) {
        return 'water';
      }

      return 'sky';
    }

    // Superfície
    if (y === terrainHeight) {
      if (terrainHeight >= seaLevel - 2) {
        return 'sand';
      }

      return 'grass';
    }

    // Camada abaixo da superfície
    if (y < terrainHeight + 7) {
      return 'earth';
    }

    // Profundidade
    if (y < terrainHeight + 20) {
      return 'rock1'
    }

    if (y < terrainHeight + 40) {
      return 'rock2';
    }
    return 'rock3';
  }

  getIndex(x, seed) {
    const height =
      Math.sin(x * 0.08 + seed) * 3 +
      Math.sin(x * 0.025 + seed * 2) * 6 +
      Math.sin(x * 0.01 + seed * 3) * 10;

    return Math.floor(this.rows * 0.55 + height);
  }
}