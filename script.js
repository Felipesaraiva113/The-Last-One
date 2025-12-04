const theme = document.getElementById('theme');
const zombieSound = document.getElementById('zombie-sound');
const deadBodys = document.getElementById('deadBodys');
const life = document.getElementById('life');
const drone = document.querySelector('.drone');
let wLife = 100;
let zombieClicked = false;
let killMoment = 0;
let wLife2 = 0;
function getCentroW() {
  const w = document.querySelector('.w');
  const gameBoard = document.querySelector('.game-board');
  const wRect = w.getBoundingClientRect();
  const boardRect = gameBoard.getBoundingClientRect();
  const wXRelativo = wRect.left - boardRect.left;
  const wYRelativo = wRect.top - boardRect.top;
  const centroX= wXRelativo + (wRect.width/2); 
  const centroY= wYRelativo + (wRect.height/2);
  return {x: centroX,y:centroY};
}
function getSpawnPosition() {
  const gameBoard = document.querySelector('.game-board');
  const boardWidth = gameBoard.clientWidth;
  const boardHeight = gameBoard.clientHeight;
  const edge = Math.floor(Math.random()*4);
  let spawnX, spawnY;
  if (edge === 0) {
    spawnX = Math.random()*boardWidth;
    spawnY = 0;
  } else if (edge === 1) {
    spawnX = boardWidth;
    spawnY = Math.random() * boardHeight;
  } else if (edge === 2) {
    spawnX = Math.random() * boardWidth;
    spawnY = boardHeight;
  } else {
    spawnX = 0;
    spawnY = Math.random() * boardHeight;
  }
  return {x: spawnX, y: spawnY};
}
class Zombies {
  constructor(id, speed, target) {
    const spawnPos = getSpawnPosition();
    this.id = id;
    this.element = document.createElement('img');
    this.element.classList.add('zombies');
    this.x = spawnPos.x;
    this.y = spawnPos.y;
    this.speed = speed;
    this.target = target;
    this.last_damage = performance.now();
    this.centerX = target.x;
    this.firstX = spawnPos.x;
    const centroW = target.x;
    if (spawnPos.x > centroW) {
      this.element.src = 'imagens/walking zombie left.gif';
    } else {
      this.element.src = 'imagens/walking zombie right.gif';
    }

    this.element.style.position = 'absolute';
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    document.querySelector('.game-board').appendChild(this.element);
  }
  update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
       
    if (distance >= 2) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }
    if (distance < 5 && this.firstX > this.centerX) {
      this.element.src = 'imagens/normal zombie left.png';
    } else if (distance < 5 && this.firstX < this.centerX) {
      this.element.src = 'imagens/normal zombie right.png';
    };
    if (distance < 5) {
      const now = performance.now();
      if (now - this.last_damage > 1000 && wLife > 0) {
        wLife -= 1;
        this.last_damage = now;
      }
    }
  }
}
class Drone {
  constructor() {
    this.element = document.createElement('img');
    this.element.classList.add('drone');
    document.querySelector('.game-board').appendChild(this.element);
  }
  killMode() {
    const now2 = performance.now();
    if (zombieClicked === true) {
      this.element.src = 'imagens/drone killing.png'
      if (now2-killMoment > 250) {
        zombieClicked = false;
      }
    } else {
      this.element.src = 'imagens/drone.png'
    }
  }
}
let activeZombies = [];
let deadZombies = 0;
let id = 1;
function scoreUpdate() {
    deadBodys.innerText = `Zumbis mortos: ${deadZombies}`;
}
function createZombie() {
  const targetW = getCentroW();
  let zombie = new Zombies(id++, 4, targetW); 
  activeZombies.push(zombie);
  zombie.element.addEventListener('click', () => { 
  if (wLife > 0) {
  zombieClicked = true;
  killMoment = performance.now();
  deadZombies += 1;
  activeZombies = activeZombies.filter(z => z.id !== zombie.id);
  zombie.element.remove();
  }
});
}
function lifeUpdate() {
    life.innerText = `Vida: ${wLife}`;
}
let previousState = 'alive';
drone_object = new Drone();
function gameLoop() {
  drone_object.killMode();
  let currentState = wLife > 0? 'alive' : 'dead';
  if (currentState !== previousState) {
    if (currentState === 'dead') {
      theme.pause();
    } else {
      theme.play();
    };
    previousState = currentState;
  }
  activeZombies.forEach(zombie => zombie.update());
  scoreUpdate();
  lifeUpdate();
  requestAnimationFrame(gameLoop);
}
let myInterval = 0;
document.addEventListener('DOMContentLoaded', ()=>{
  myInterval = setInterval(() => {
    if (wLife <= 0) {
      wLife = 0;
      clearInterval(myInterval);
      return;
    }
    createZombie();
  },500);
    requestAnimationFrame(gameLoop);
});
document.addEventListener('DOMContentLoaded', ()=>{
  theme.volume = 0.2;
  zombieSound.volume = 1;
    secondInterval = setInterval(() => {
      if (wLife <= 0) {
      wLife2 += 1;
      if (wLife2 === 4) {
        clearInterval(secondInterval);
        if (wLife <= 0) {
          const msg = document.createElement('h1');
          msg.innerText = 'GAME OVER';
          msg.classList.add('game-over');
          document.querySelector('.informations').appendChild(msg);
        }
      };
    }
    },1000);
});


