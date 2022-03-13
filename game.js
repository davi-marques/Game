'use strict';

//              PROPIEDADES DO JOGO

// Cria o canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 482;

// Contador de sprites
var count = 0;
var posI = 0;
var Up_ou_Down = false;

// Imagem de fundo
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = 'images/background.png';

// Imagem do herói
var heroImage = new Image();
heroImage.src = 'images/hero.png';

// Imagem do mostro
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = 'images/monster.png';

// Objetos do jogo
var hero = {
    speed: 230, // movimento em pixels p/s
    x: canvas.width / 2,
    y: canvas.height / 2,

    // onde começa na imagem
    srcX: 0,
    srcY: 1,

    // Coordenadas da imagem
    altura: 32,
    largura: 32
};

var monster = {};

var monstersCaught = 0;

// Sons do jogo
var pegou = new Audio('audio/track.mp3');
var pegouStar = new Audio('audio/vintage.mp3');

// Controle do teclado
var keysDown = {};

window.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
}, false);

//              FUNÇÕES DO JOGO

// Reseta quando o jogador pega o monstro

var reset = function reset() {
    // Posiciona o monstro randomicamente na tela
    monster.x = 32 + Math.random() * (canvas.width - 96);
    monster.y = 32 + Math.random() * (canvas.height - 96);
};

function Encostaram() {
    if (hero.x <= monster.x + 32 && monster.x <= hero.x + 32 && hero.y <= monster.y + 32 && monster.y <= hero.y + 32) {
        return true;
    }
}

function Sprite(posY) {
    count++;
    hero.srcY = hero.altura * posY;
    if (count >= 20) {
        count = 0;
    }
    hero.srcX = Math.floor(count / 10) * hero.largura;
}

function animation() {

    if (40 in keysDown || 83 in keysDown) {
        // Para baixo
        Sprite(0);
        posI = 0;
        Up_ou_Down = true;
    } else if (38 in keysDown || 87 in keysDown) {
        // Para cima
        Sprite(2);
        posI = 2;
        Up_ou_Down = true;
    } else if (39 in keysDown || 68 in keysDown) {
        // Para direita
        Sprite(1);
        posI = 1;
        Up_ou_Down = false;
    } else if (37 in keysDown || 65 in keysDown) {
        // Para esquerda
        Sprite(3);
        posI = 3;
        Up_ou_Down = false;
    } else {
        count = 0;
        hero.srcY = hero.altura * posI;
        if (Up_ou_Down) {
            hero.srcX = Math.floor(20 / 10) * hero.largura;
        } else {
            hero.srcX = Math.floor((count + 20) / 10) * hero.largura;
        }
    }
}

// Atualiza
var update = function update(modifier) {
    // Teclas precionadas

    if (38 in keysDown || 87 in keysDown) {
        // Pressionando a seta para cima
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown || 83 in keysDown) {
        // Pressionando a seta para baixo
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown || 65 in keysDown) {
        // Pressionando a seta para esquerda
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown || 68 in keysDown) {
        // Pressionando a seta para direita
        hero.x += hero.speed * modifier;
    }

    hero.x = Math.max(28, Math.min(canvas.width - 28 - hero.largura, hero.x));
    hero.y = Math.max(28, Math.min(canvas.height - 28 - hero.altura, hero.y));

    // Se os personagems se enconstaram
    if (Encostaram()) {
        monstersCaught++;
        reset();
        pegou.play();
    }
};

// Renderiza tudo - desenha

var render = function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    ctx.drawImage(heroImage, hero.srcX, hero.srcY, hero.largura, hero.altura, hero.x, hero.y, hero.largura, hero.altura);
    animation();

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Pontuação
    ctx.fillStyle = '#fff';
    ctx.font = "17px 'Press Start 2P'";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Monstros pegos: ' + monstersCaught, 37, 37);

    if (monstersCaught > 0) {
        if (monstersCaught % 10 == 0) {
            // Mostra estrela e o som
            monsterImage.src = 'images/star.png';
            pegouStar.play();

            // Pontuação de estrelas
            ctx.fillStyle = '#fff';
            ctx.font = "17px 'Press Start 2P'";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('Estrelas pegas: ' + (monstersCaught - 10) / 10, 38, 419);
        } else {
            monsterImage.src = 'images/monster.png';
        };
    };
};

// Controla o loop do jogo
var main = function main() {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Executa isso o mais rápido possível
    requestAnimationFrame(main);
};

// Suporte cross-browser para requestAnimationFrame
var w = window;
var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Que comece o jogo!
var then = Date.now();
reset();
main();
