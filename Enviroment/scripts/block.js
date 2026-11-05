class block {
  id;
  type;
  blockPos;
  size;

  constructor(id, type, blockPos, size) {
    this.id = id;
    this.type = type;
    this.blockPos = blockPos;
    this.size = size;
  }
}

export class Scene {
  allPosition = [];
  position = [0, 0];
  allBlocks = [];
  posValueX;
  posValueY;

  constructor(posValueX, posValueY) {
    this.posValueX = posValueX;
    this.posValueY = posValueY;
  }

  generateArrayOfPosition() {

    for (let i = 0; i < 10; i++) {
      let columns = [];
      this.position[0] = 0;
      if (i === 0) {
        this.position[1] = 0;
      }
      else {
        this.position[1] += this.posValueY;
      }
      columns.push(
        {
          x: this.position[0],
          y: this.position[1]
        }
      );
      for(let j = 0; j < 10; j++) {
        this.position[0] += Math.round(this.posValueX);
        columns.push(
          {
            x: this.position[0],
            y: this.position[1]
          }
        );
      }
      this.allPosition.push(columns);
    }
  }

  generateBlock() {
    let index = 0;

    let id;
    let type;
    let blockPos;
    let size = [this.posValueX, this.posValueY];

    this.allPosition.forEach((row) => {
      row.forEach((column) => {

        index++;
        id = index;

        type = this.giveType();

        if (index < 80) { // Sky
          type = 'sky';
        }
        else if (index < 90) { // Water
          type = 'water';
        }
        else if (index <= 93) { //  Rock
          type = 'rock';
        }
        else if (index > 93) { // Earth
          type = 'earth';
        }
        blockPos = [column.x, column.y];  
        this.allBlocks.push(
          new block(
            id,
            type,
            blockPos,
            size
          )
        );
        this.navigateAndCreateBlocks();
      });
    });
  }
  giveType() {
    // const index = randomizeIndex();
    return 'sky';
  }
  randomizeIndex() {
    const index = 1;
    return index;
  }

  navigateAndCreateBlocks() {
    const main = document.querySelector('main');
    this.allBlocks.forEach(block => {
      const div = document.createElement('div');

      div.classList.add('block');
      div.style.width = `${block.size[0]}px`;
      div.style.height = `${block.size[1]}px`;
      div.classList.add(block.type);
      div.style.translate = `${block.blockPos[0]}px ${block.blockPos[1]}px`;

      main.appendChild(div);
    });
  }
};