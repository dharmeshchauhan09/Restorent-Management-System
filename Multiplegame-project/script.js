const player = document.getElementById("player");
const orb = document.getElementById("orb");
const obstacle = document.getElementById("obstacle");
const scoreText = document.getElementById("score");

let score = 0;
let speed = 4;
let gameOver = false;
let playerX = window.innerWidth / 2;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") playerX -= 50;
  if (e.key === "ArrowRight") playerX += 50;
  player.style.left = `${playerX}px`;
});

function randomX() {
  return Math.floor(Math.random() * (window.innerWidth - 30));
}

function checkCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function gameLoop() {
  if (gameOver) return;

  [orb, obstacle].forEach(el => {
    let top = parseFloat(el.style.top || "-50px");
    top += speed;
    el.style.top = `${top}px`;
    if (top > window.innerHeight) {
      el.style.top = "-50px";
      el.style.left = `${randomX()}px`;
    }
  });

  if (checkCollision(player, orb)) {
    score++;
    orb.style.top = "-50px";
    orb.style.left = `${randomX()}px`;
    speed += 0.1;
    scoreText.textContent = `Score: ${score}`;
  }

  if (checkCollision(player, obstacle)) {
    gameOver = true;
    alert("Time distortion hit! Game Over!");
    location.reload();
  }

  requestAnimationFrame(gameLoop);
}

orb.style.left = `${randomX()}px`;
obstacle.style.left = `${randomX()}px`;
gameLoop();