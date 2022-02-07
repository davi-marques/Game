// Cria o canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


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
const mosterImage = new Image();
mosterImage.onload = function() {
    monsterReady = true;
};
mosterImage.src = 'images/monster.png';


// Imagem da Estrela
let starReady = false;
const starImage = new Image();
starImage.onload = function() {
    starReady = true;
};
starImage.src = 'images/star.png';

// Objetos do jogo
const hero = {
    speed: 256, // movimento em pixels p/s
    x: canvas.width / 2,
    y: canvas.height / 2
};

const star = {
    x: canvas.width / 2,
    y: canvas.height / 2 
}

const monster = {};

let monstersCaught = 0;

const pegou = new Audio('audio/track.mp3');

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
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
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
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
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
        ctx.drawImage(mosterImage, monster.x, monster.y)
    }

    // Pontuação
    ctx.fillStyle = '#fff';
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Mostros pegos: ' + monstersCaught, 32, 32);

    if (monstersCaught == 10){
        ctx.drawImage(starImage, star.x, star.y)
    }
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