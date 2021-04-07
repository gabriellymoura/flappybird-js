console.log('Flappy Bird');

const somHit = new Audio();
somHit.src = './efeitos/efeitos_hit.wav';

const somPula = new Audio();
somPula.src = './efeitos/efeitos_pulo.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,

  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};


const gameStart = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      gameStart.sX, gameStart.sY,
      gameStart.w, gameStart.h,
      gameStart.x, gameStart.y,
      gameStart.w, gameStart.h
    );
  }
}
function colisao(flappyBird, chao){
  const flappybirdY = flappyBird.y +flappyBird.altura;
  const chaoY = chao.y;

  if(flappybirdY >= chaoY){
    return true;
  }
  return false;
}

function criaFlappyBird(){
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade:0,
    pulo:4.6,
  
    desenha() {
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    },
  
    atualiza(){
      if(colisao(flappyBird,chao)){
        console.log('fez colisão');
        somHit.play();
        mudaTela(telas.INICIO);
        return;
      }
  
      flappyBird.velocidade =  flappyBird.velocidade + flappyBird.gravidade;
      //flappyBird.x = flappyBird.x + 1;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    pula(){
      somPula.play();
      flappyBird.velocidade = -flappyBird.pulo;
  
    },
  }
  return flappyBird;
}

const globais = {};
let telaAtiva = {};
function mudaTela(novatela){
  telaAtiva= novatela;

  if(telaAtiva.inicializa){
    telaAtiva.inicializa();
  }
}

const telas = {
  INICIO: {
    inicializa(){
      globais.flappyBird = criaFlappyBird();
    },
    desenha(){
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();

      gameStart.desenha();
    },
    click(){
      mudaTela(telas.JOGO);
    },
    atualiza(){

    }
  },
  JOGO:{
    desenha(){
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
    },
    click(){
      globais.flappyBird.pula();
    },
    atualiza(){
      globais.flappyBird.atualiza();
    }
  }
}

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  
  requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
})

mudaTela(telas.INICIO);
loop();