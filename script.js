const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restart");

const grid = 20;
let snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 }
];

let dx = grid;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let gameOverFlag = false;

let food = { x: 300, y: 300 };

document.addEventListener("keydown", e => {
    if (gameOverFlag) return;

    switch (e.key) {
        case "ArrowUp":    if (dy !== grid) { dx = 0; dy = -grid; } break;
        case "ArrowDown":  if (dy !== -grid) { dx = 0; dy = grid; } break;
        case "ArrowLeft":  if (dx !== grid) { dx = -grid; dy = 0; } break;
        case "ArrowRight": if (dx !== -grid) { dx = grid; dy = 0; } break;
    }
});

restartBtn.addEventListener("click", resetGame);

function randomFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;

    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return randomFood();
        }
    }
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        randomFood();
    } else {
        snake.pop();
    }

    snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? "#0f0" : "#0a0";
        ctx.fillRect(segment.x, segment.y, grid, grid);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(segment.x, segment.y, grid, grid);
    });

    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, grid, grid);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    gameOverFlag = true;
    clearInterval(gameInterval);
    
    // Atualiza o recorde
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    
    alert(`Game Over!\nPontuação: ${score}\nRecorde: ${highScore}`);
}

function resetGame() {
    snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
    dx = grid; dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOverFlag = false;
    randomFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    if (gameOverFlag) return;
    draw();
    if (checkCollision()) gameOver();
}

// Iniciar
randomFood();
gameInterval = setInterval(gameLoop, 100);
