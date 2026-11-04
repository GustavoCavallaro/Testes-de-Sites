const enemy = createElement('img');

enemy.src = './inimigo';

let enemyPos = [0, 0];

for (let i = 0; i < 20; i++) {
  createEnemy(enemy);
}

function createEnemy (enemy) {
  this.enemy = enemy;

  this.enemy.style.translate = `${pos[0]}px ${pos[1]}px`;

  if (pos[0] + 50 < innerWidth) {
    pos[0] += 50;
  }
  pos[1] += 50;

  document.body.appendChild(this.enemy);

}