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
    // importante: forçar position e colocar em board
    this.element.style.position = 'absolute';
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    document.querySelector('.game-board').appendChild(this.element);
  }
  update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // 🔧 Se o zumbi estiver muito perto do alvo, não atualiza mais
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
  console.log('DIÁRIO DE PANDEMIA DO W: DIA 229.');
  console.log('LOCAL: NOVA BASE DOS "MOCHILEIROS DO PIOR APOCALIPSE DAS GALÁXIAS (M.P.A.G)" - ainda odeio esse nome, Karl.');
  console.log('Já faz um mês desde que nossa antiga base foi destruída por aquele zumbi desgraçado que um dia foi o Capitão Osso Duro. Desde então, ficamos deslocados, sem abrigo nem proteção, vagando em busca de suprimentos e uma nova base como cães abandonados. Mas hoje, a peregrinação finalmente nos recompensou: encontramos uma estrutura fortificada de nível militar, quase intocada. Eletricidade, reforços estruturais. É até estranho pensar que tudo isso estava esondido no subterrâneo de uma filial da Robscorp, mas isso não importa agora.');
  console.log('A maior descoberta, no entanto, não foi o bunker, mas o novo anfitrião. Um garoto magricela de armadura negra, o herdeiro legítimo desta instalação. Ele nunca tira o capacete. Frio e silencioso, mais do que eu. É ele quem opera a engenhoca de defesa: Drones Esféricos de Alta Tecnologia – Karl o chamou de "O Olho de Horus". Vi um deles desintegrar um bando de zumbis com apenas um "pensamento" de sua IA. Tecnologia impressionante, mesmo para mim.')
  console.log('Ele nos tolera, mas há algo no seu olhar (na fresta do capacete) que me diz que ele me odeia. Não confio nele. Se não fosse por Karl, eu o teria eliminado e tomado a base para nós. Mas o olhar dele... É uma sensação estranha de déjà vu. Algo que me lembra do Harry, o que é um absurdo, já que eu o vi sendo transformado em zumbi na minha frente. Não consigo pensar nisso. Não agora.');
  console.log('Somos agora seis. Temos Karl, Lana, Matthew, dr. Bagtavius/Baguete (devido so cabeção e suas características francesas) e o garoto sem nome. A contagem de mortos sempre volta: Ryan, GPU, Hashi e Caroline. Eu não vou deixar esse número subir.');
  console.log('CONCLUSÃO: O objetivo imediato é claro: adaptar-se, assegurar o perímetro e, o mais importante, extrair o máximo de informação e tecnologia bélica do nosso novo anfitrião.Espero que a "paz" de hoje dure até lá.');
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


