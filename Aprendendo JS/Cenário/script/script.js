class Block {
  blockName;
  posX = 0;
  posY = 0;

  putElementsInTheWindow() {
    const div = document.createElement('div');
    div.classList.add('block');
    const sceneLength = document.querySelectorAll('.block').length;

    this.posX = 
    (sceneLength % 10 === 0)? this.posX + 50: 0;

    
    
    div.classList.add(this.blockName);
    div.style.translate = `${this.posX}px ${this.posY}px`;
    document.querySelector('main').appendChild(div);
  }
}

class Scene {

  generateSceneElements() {
    let blockNumber = 0;
    for(let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        blockNumber++;
        let block;
        let element;
        
        if (blockNumber <= 80) {
          block = new Block(this.size);
          element = 'sky';
        }
        else if (blockNumber <= 90) {
          block = new Block(this.size);
          element = 'water';
        }
        else if (blockNumber < 95) {
          block = new Block(this.size);
          element = 'rock';
        }
        else if (blockNumber >= 95) {
          block = new Block(this.size)
          element = 'earth';
        }
        block.blockName = element;
        block.putElementsInTheWindow();
      }
    }
  }
}

const scene = new Scene(50, 50);
scene.generateSceneElements();

document.querySelectorAll('.block').forEach((block, index) => {
  block.classList.add(`block-${index}`);
});