// Basic variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let box = 20;
let snake = [];
let direction = "RIGHT";
let food;
let score = 0;
let game;
let speed = 100;
let snakeColor = "#0f0";

// Load DOM elements
const menu = document.getElementById("menu");
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const scoreText = document.getElementById("score");
const finalScore = document.getElementById("final-score");
const highScoreText = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over-screen");

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeColor : "#fff";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    showGameOver();
    return;
  }

  snake.unshift(newHead);
  scoreText.textContent = score;
  if (score > (localStorage.getItem("highScore") || 0)) {
    localStorage.setItem("highScore", score);
  }
  highScoreText.textContent = localStorage.getItem("highScore") || 0;
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

function startGame() {
  direction = "RIGHT";
  score = 0;
  snake = [];
  snake[0] = { x: 9 * box, y: 10 * box };
  food = randomFood();

  speed = parseInt(document.getElementById("level").value);
  snakeColor = document.getElementById("color").value;

  menu.style.display = "none";
  gameOverScreen.style.display = "none";
  gameArea.style.display = "block";

  game = setInterval(drawGame, speed);
}

function showGameOver() {
  gameArea.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScore.textContent = score;
}

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
backBtn.onclick = () => {
  gameOverScreen.style.display = "none";
  menu.style.display = "block";
};

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

document.querySelectorAll(".ctrl").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir");
    if (dir === "left" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "up" && direction !== "DOWN") direction = "UP";
    if (dir === "right" && direction !== "LEFT") direction = "RIGHT";
    if (dir === "down" && direction !== "UP") direction = "DOWN";
  });
});
