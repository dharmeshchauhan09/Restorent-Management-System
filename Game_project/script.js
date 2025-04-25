const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

const startBtn = document.getElementById('startBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');

let bird, pipes, frame, score, level, pipeGap;
let gameStarted = false;
let isGameOver = false;
let movingUp = false;  // Flag for smooth upward movement
let movingDown = false;  // Flag for smooth downward movement

function initGame() {
  bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    velocity: 0,
    speed: 0.8,  // Rate of speed change
    maxSpeed: 8, // Max downward speed
    minSpeed: -8 // Max upward speed
  };
  pipes = [];
  frame = 0;
  score = 0;
  isGameOver = false;
  pipeGap = 100 - (level - 1) * 5;
  if (pipeGap < 50) pipeGap = 50;
  scoreDisplay.textContent = `Score: 0`;
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
}

function update() {
  if (isGameOver || !gameStarted) return;

  // Smooth vertical movement with a faster response when keys are held down
  if (movingUp && bird.velocity > bird.minSpeed) {
    bird.velocity -= bird.speed;  // Move up (decrease velocity)
  } else if (movingDown && bird.velocity < bird.maxSpeed) {
    bird.velocity += bird.speed;  // Move down (increase velocity)
  } else if (!movingUp && !movingDown) {
    // If no keys are pressed, let gravity pull the bird down at a constant rate
    bird.velocity += 0.2;  // Gravity
  }

  // Update bird's position based on velocity
  bird.y += bird.velocity;

  // Boundaries
  if (bird.y + bird.height > canvas.height) bird.y = canvas.height - bird.height;
  if (bird.y < 0) bird.y = 0;

  if (frame % 90 === 0) {
    let top = Math.random() * 150 + 50;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: top,
      bottom: top + pipeGap
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Collision detection with pipes
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      isGameOver = true;
      nextLevelBtn.disabled = true;  // Disable next level button if game over
    }
  });

  if (score >= 10 && level < 10) {
    nextLevelBtn.disabled = false;
  }

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  pipes.forEach(drawPipe);

  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "26px Arial";
    ctx.fillText("Game Over!", 80, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function jump() {
  if (!gameStarted) return;
  movingUp = true;  // Start moving up
}

function stopJump() {
  movingUp = false;  // Stop moving up when key is released
}

function moveDown() {
  if (!gameStarted) return;
  movingDown = true;  // Start moving down
}

function stopMoveDown() {
  movingDown = false;  // Stop moving down when key is released
}

function startGame() {
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  nextLevelBtn.disabled = true;
  gameStarted = true;
  isGameOver = false;
  initGame();
  gameLoop();
}

function nextLevel() {
  if (level < 10) {
    level++;
    levelDisplay.textContent = `Level: ${level}`;
    nextLevelBtn.disabled = true;
    initGame();
  }
}

startBtn.addEventListener("click", startGame);
nextLevelBtn.addEventListener("click", nextLevel);

// Mouse events for jumping
window.addEventListener("mousedown", jump);
window.addEventListener("touchstart", jump);

// Keyboard events for controlling bird
window.addEventListener("keydown", function (e) {
  if (e.code === "ArrowUp" || e.code === "Space") {
    jump();  // Bird starts moving up
  } else if (e.code === "ArrowDown") {
    moveDown();  // Bird starts moving down
  }
});

window.addEventListener("keyup", function (e) {
  if (e.code === "ArrowUp" || e.code === "Space") {
    stopJump();  // Stop upward movement when key is released
  } else if (e.code === "ArrowDown") {
    stopMoveDown();  // Stop downward movement when key is released
  }
});
