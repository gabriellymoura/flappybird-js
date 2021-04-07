console.log('Flappy Bird');

let frames = 0;

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
};

const gameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      gameOver.sX, gameOver.sY,
      gameOver.w, gameOver.h,
      gameOver.x, gameOver.y,
      gameOver.w, gameOver.h
    );
  }
};


function criaChao(){
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza(){
      const movimentoChao = 1;
      const repete = chao.largura/2;
      const movimentacao = chao.x - movimentoChao;
      chao.x = movimentacao % repete;
      console.log('mexer o chão');
    },
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
  return chao;
};

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
  
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 

        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
      
      if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if(peDoFlappy >= par.canoChao.y) {
          return true;
        }
        //globais.placar.pontuacao = globais.placar.pontuacao+1;
      }
      return false;
      
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!')
          somHit.play();
          mudaTela(telas.GAMEOVER);
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
};

function criaPlacar(){
  const placar = {
    pontuacao: 0,
    desenha(){
      contexto.font = '35px "VT323"';
      contexto.fillStyle = 'white';
      contexto.textAlign = 'right';
      contexto.fillText(`${placar.pontuacao}`,canvas.width -10,35);
    },
    atualiza(){
      const intervaloDeFrames = 20;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    },
  }

  return placar;
}

function colisao(flappyBird, chao){
  const flappybirdY = flappyBird.y +flappyBird.altura;
  const chaoY = chao.y;

  if(flappybirdY >= chaoY){
    return true;
  }
  return false;
};

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

    movimentos: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],
    frameAtual: 0,

    atualizaFrameAtual(){
      const intevaloFrames = 10;
      const passouIntervalo = frames % intevaloFrames === 0;

      if(passouIntervalo){
        console.log(frames);
        const baseIncremento = 1;
        const incremeto = baseIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremeto % baseRepeticao
      }
    },
  
    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual]
      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    },
  
    atualiza(){
      if(colisao(flappyBird,globais.chao)){
        console.log('fez colisão');
        somHit.play();
        mudaTela(telas.GAMEOVER);
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
};

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
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha(){
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      gameStart.desenha();
    },
    click(){
      mudaTela(telas.JOGO);
    },
    atualiza(){
      globais.chao.atualiza();
    }
  },
  JOGO:{
    inicializa(){
      globais.placar = criaPlacar();
    },
    desenha(){
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.placar.desenha();
    },
    click(){
      globais.flappyBird.pula();
    },
    atualiza(){
      globais.flappyBird.atualiza();
      globais.chao.atualiza();
      globais.canos.atualiza();
      globais.placar.atualiza();
    }
  },
  GAMEOVER: {
    desenha(){
      gameOver.desenha();
    },
    atualiza(){

    },
    click(){
      mudaTela(telas.INICIO);
    }
  }
}

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  
  frames = frames +1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
})

mudaTela(telas.INICIO);
loop();