const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const controlButtons = document.querySelectorAll('.control-btn');

const boardSize = 20;
let snake, direction, food, score, gameInterval;

startBtn.onclick = () => {
  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startGame();
};

restartBtn.onclick = () => {
  gameOverScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  startGame();
};

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = spawnFood();
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  draw();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 150);
}

function draw() {
  board.innerHTML = '';
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (snake.some(seg => seg.x === x && seg.y === y)) {
        cell.classList.add('snake');
      } else if (food.x === x && food.y === y) {
        cell.classList.add('food');
      }

      board.appendChild(cell);
    }
  }
}

function gameLoop() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 || head.x >= boardSize ||
    head.y < 0 || head.y >= boardSize ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    return endGame();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function spawnFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
  return newFood;
}

// Arrow keys for desktop
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

// Touch buttons for mobile
controlButtons.forEach(button => {
  button.addEventListener('click', () => {
    const dir = button.dataset.dir;
    if (dir === 'up' && direction.y === 0) direction = { x: 0, y: -1 };
    if (dir === 'down' && direction.y === 0) direction = { x: 0, y: 1 };
    if (dir === 'left' && direction.x === 0) direction = { x: -1, y: 0 };
    if (dir === 'right' && direction.x === 0) direction = { x: 1, y: 0 };
  });
});

function endGame() {
  clearInterval(gameInterval);
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  finalScore.textContent = "Score: " + score;
}