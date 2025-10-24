const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menuDiv = document.getElementById("menu");
const scoresDiv = document.getElementById("scores");
const music = document.getElementById("music");
const btnStart = document.getElementById("btn-start");
const btnScores = document.getElementById("btn-scores");
const btnBack = document.getElementById("btn-back");
const scoreList = document.getElementById("score-list");

// Ajusta o tamanho do canvas conforme a janela
function resizeCanvas() {
  const scale = Math.min(window.innerWidth / 800, window.innerHeight / 600);
  canvas.width = 800 * scale;
  canvas.height = 600 * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0); // redimensiona tudo proporcionalmente
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Sons
const correctSound = new Audio("correct.wav");
const wrongSound = new Audio("wrong.ogg");

let gameState = "menu";
let bananas = 0, maxBananas = 0;
let question = "", correctAnswer = 0, userAnswer = "";
let highScores = [0, 0, 0];
let monkeyFrame = 0;

const images = {};
const names = [
  "background.png", "menu_background.png", "score_background.png",
  "monkey_idle.png", "monkey_blink.png", "basket.png", "banana.png"
];

let loaded = 0;
for (let n of names) {
  const img = new Image();
  img.src = n;
  img.onload = () => {
    loaded++;
    if (loaded === names.length) drawMenu();
  };
  images[n] = img;
}

function drawTextPlaque(text, x, y, w, h, color="#FFF", bg="#6B8E23") {
  ctx.fillStyle = "white";
  ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
}

function generateQuestion() {
  const n1 = Math.floor(Math.random()*10)+1;
  const n2 = Math.floor(Math.random()*10)+1;
  const ops = ["+","-","*","/"];
  const op = ops[Math.floor(Math.random()*ops.length)];
  switch(op){
    case "+": return [`${n1}+${n2}`, n1+n2];
    case "-": return [`${n1}-${n2}`, n1-n2];
    case "*": return [`${n1}*${n2}`, n1*n2];
    case "/": return [`${n1*n2}/${n2}`, n1];
  }
}

function drawBananas() {
  const maxPerColumn = 20, colSpace = 30, rowSpace = 15;
  for(let i=0;i<bananas;i++){
    const col = Math.floor(i/maxPerColumn);
    const row = i%maxPerColumn;
    const x = 210+col*colSpace, y = 430-row*rowSpace;
    ctx.drawImage(images["banana.png"], x, y);
  }
}

function drawGame() {
  ctx.drawImage(images["background.png"], 0, 0, 800, 600);
  monkeyFrame++;
  const img = (Math.floor(monkeyFrame/60)%2===0)?images["monkey_idle.png"]:images["monkey_blink.png"];
  ctx.drawImage(img, 100, 200);
  ctx.drawImage(images["basket.png"], 200, 400);
  drawBananas();
  drawTextPlaque(`Questão: ${question}`, 250, 50, 300, 50);
  drawTextPlaque(`Resposta: ${userAnswer}`, 250, 100, 300, 50);
  drawTextPlaque(`Bananas: ${bananas}`, 250, 150, 300, 50);
}

function startGame() {
  menuDiv.classList.add("hidden");
  scoresDiv.classList.add("hidden");
  canvas.style.display = "block";
  document.body.classList.add("playing");
  if (music.paused) music.play();

  bananas = 0;
  maxBananas = 0;
  [question, correctAnswer] = generateQuestion();
  userAnswer = "";
  gameState = "game";
  loop();
}

function loop() {
  if (gameState === "game") {
    drawGame();
    requestAnimationFrame(loop);
  }
}

function endGame() {
  highScores.push(maxBananas);
  highScores.sort((a,b)=>b-a);
  highScores = highScores.slice(0,3);
  gameState = "menu";
  canvas.style.display = "none";
  document.body.classList.remove("playing");
  drawMenu();
}

function drawMenu() {
  menuDiv.classList.remove("hidden");
  scoresDiv.classList.add("hidden");
  canvas.style.display = "none";
}

function showScores() {
  menuDiv.classList.add("hidden");
  scoresDiv.classList.remove("hidden");
  scoreList.innerHTML = "";
  highScores.forEach((s,i)=>{
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${s}`;
    scoreList.appendChild(li);
  });
}

document.addEventListener("keydown", e=>{
  if(gameState==="game"){
    if(e.key==="Enter"){
      if(parseInt(userAnswer)==correctAnswer){
        correctSound.play();
        bananas++;
        maxBananas=Math.max(maxBananas,bananas);
        [question,correctAnswer]=generateQuestion();
        userAnswer="";
      } else {
        wrongSound.play();
        if(bananas>0) bananas=0;
        else endGame();
      }
    } else if(e.key==="Backspace"){
      userAnswer=userAnswer.slice(0,-1);
    // Permite dígitos e sinal de menos no início
    } else if (e.key === "-" && userAnswer.length === 0) {
      userAnswer = "-";
    } else if (/\d/.test(e.key)) {
      userAnswer += e.key;
    }

  }
});

btnStart.onclick = startGame;
btnScores.onclick = showScores;
btnBack.onclick = drawMenu;
