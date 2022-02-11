// Cria o canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;


// Imagem de fundo
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = 'images/background.png';


// Imagem do herói
let heroReady = false;
const heroImage = new Image();
heroImage.onload = function() {
    heroReady = true;
};
heroImage.src = 'images/hero.png';


// Imagem do mostro
let monsterReady = false;
const monsterImage = new Image();
monsterImage.onload = function() {
    monsterReady = true;
};
monsterImage.src = 'images/monster.png';

let star = {}

// Objetos do jogo
const hero = {
    speed: 256, // movimento em pixels p/s
    x: canvas.width / 2,
    y: canvas.height / 2
};

const monster = {};

let monstersCaught = 0;

// Sons do jogo
const pegou = new Audio('audio/track.mp3');
const pegouStar = new Audio('audio/vintage.mp3')

// Controle do teclado
const keysDown = {};

window.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
}, false);


// Reseta quando o jogador pega o monstro

const reset = function(){
    // Posiciona o monstro randomicamente na tela
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
}

function Encostaram() {
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        return true;
    }
}

// Atualiza
const update = function(modifier){
    if (38 in keysDown || 87 in keysDown) { // Pressionando a seta para cima
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown || 83 in keysDown) { // Pressionando a seta para baixo
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown || 65 in keysDown) { // Pressionando a seta para esquerda
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown || 68 in keysDown) { // Pressionando a seta para direita
        hero.x += hero.speed * modifier;
    }

    // Se os personagems se enconstaram
    if (Encostaram()) {
        monstersCaught++;
        reset();
        pegou.play();
    }
};

// Renderiza tudo - desenha

const render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y)
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y)
    }

    // Pontuação
    ctx.fillStyle = '#fff';
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Mostros pegos: ' + monstersCaught, 32, 32);

    if (monstersCaught > 0) {
        if (monstersCaught%10 == 0){
            monsterImage.src = 'images/star.png';
            pegouStar.play()
        } else {
            monsterImage.src = 'images/monster.png';
        };
    };
};

// Controla o loop do jogo
const main = function(){
    const now = Date.now();
    const delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Executa isso o mais rápido possível
    requestAnimationFrame(main);
};

// Suporte cross-browser para requestAnimationFrame
const w = window;
const requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame

// Que comece o jogo!
let then = Date.now();
reset();
main();