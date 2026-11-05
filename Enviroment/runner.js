import {Scene} from './scene.js';

const scene = new Scene(1000, 1000);
addEventListener('resize', event => {
  renderScene();
});

function renderScene() {
  scene.renderScene();
}

renderScene();