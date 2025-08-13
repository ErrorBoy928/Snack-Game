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
let snakeHeadColor = "#0f0"; // head color only
let snakeBodyColor = "#fff"; // body fixed color

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

// Generate random food position NOT on snake
function randomFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? snakeHeadColor : snakeBodyColor;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, box, box);

    // Calculate new head position
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // Eat food
    if (headX === food.x && headY === food.y) {
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Wall collision (precise check)
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

    // High score update
    if (score > (localStorage.getItem("highScore") || 0)) {
        localStorage.setItem("highScore", score);
    }
    highScoreText.textContent = localStorage.getItem("highScore") || 0;
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function startGame() {
    direction = "RIGHT";
    score = 0;
    snake = [{ x: 9 * box, y: 10 * box }];
    food = randomFood();

    speed = parseInt(document.getElementById("level").value);
    snakeHeadColor = document.getElementById("color").value; // only head gets this color

    menu.style.display = "none";
    gameOverScreen.style.display = "none";
    gameArea.style.display = "block";

    clearInterval(game); // prevent double intervals
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