import {Scene} from './block.js';

const block = new Scene(innerWidth / 10, innerHeight / 10);

startAll();
function startAll() {

  block.generateArrayOfPosition();
  block.generateBlock();
  // console.log(block.allPosition);
  // console.log(block.allBlocks);
}