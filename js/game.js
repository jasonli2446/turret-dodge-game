const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player,
  bullets,
  turrets,
  turretBullets,
  inputHandler,
  spawnRate,
  lastSpawn,
  startTime,
  gameOver,
  turretsDestroyed,
  border;

function initializeGame() {
  border = {
    x: -500,
    y: -500,
    width: 2500,
    height: 1000,
  };
  player = new Player(
    border.x + border.width / 2,
    border.y + border.height / 2
  );
  bullets = [];
  turrets = [];
  turretBullets = [];
  inputHandler = new InputHandler(player, bullets);
  spawnRate = 3000;
  lastSpawn = Date.now();
  startTime = Date.now();
  gameOver = false;
  turretsDestroyed = 0;
}

function startGame() {
  startScreen.style.display = "none";
  canvas.style.display = "block";
  initializeGame();
  gameLoop();
}

startButton.addEventListener("click", startGame);

function isSpawnLocationValid(x, y) {
  for (let turret of turrets) {
    let dx = turret.x - x;
    let dy = turret.y - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) return false;
  }
  let dx = player.x - x;
  let dy = player.y - y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 200) return false;
  return true;
}

function spawnTurret() {
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  let turretTypes = ["basic"];
  if (elapsedTime > 10) turretTypes.push("fast");
  if (elapsedTime > 20) turretTypes.push("heavy");

  let x, y;
  do {
    x = Math.random() * (border.width - 100) + border.x + 50;
    y = Math.random() * (border.height - 100) + border.y + 50;
  } while (!isSpawnLocationValid(x, y));

  let type = turretTypes[Math.floor(Math.random() * turretTypes.length)];
  turrets.push(new Turret(x, y, type));
}

function drawUI() {
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Time Survived: ${elapsedTime}s`, 10, 30);
  for (let i = 0; i < player.health; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(10 + i * 25, 60, 20, 20);
  }
}

function drawGrid(ctx, cameraX, cameraY) {
  const gridSize = 50;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;

  for (let x = border.x; x <= border.x + border.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, border.y);
    ctx.lineTo(x, border.y + border.height);
    ctx.stroke();
  }

  for (let y = border.y; y <= border.y + border.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(border.x, y);
    ctx.lineTo(border.x + border.width, y);
    ctx.stroke();
  }
}

function displayGameOver(score) {
  gameOver = true;
  const scoreElement = document.createElement("div");
  scoreElement.id = "gameOver";
  scoreElement.innerHTML = `Game Over! Score: ${
    score * 100
  }<br>Turrets Destroyed: ${turretsDestroyed}`;
  document.body.appendChild(scoreElement);
  const playAgainButton = document.createElement("button");
  playAgainButton.id = "playAgain";
  playAgainButton.innerHTML = "Play Again";
  playAgainButton.onclick = () => {
    window.location.reload();
  };
  document.body.appendChild(playAgainButton);
}

function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate camera offset
  const cameraX = player.x - canvas.width / 2;
  const cameraY = player.y - canvas.height / 2;

  // Save the current context state
  ctx.save();

  // Translate the context to center the player
  ctx.translate(-cameraX, -cameraY);

  // Draw grid
  drawGrid(ctx, cameraX, cameraY);

  // Draw border
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.strokeRect(border.x, border.y, border.width, border.height);

  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedTime > 10) {
    turrets.forEach((turret) => {
      if (turret.type === "basic") turret.fireRate = 1500;
    });
  }
  if (elapsedTime > 20) {
    turrets.forEach((turret) => {
      if (turret.type === "basic") turret.fireRate = 1000;
      if (turret.type === "fast") turret.fireRate = 750;
    });
  }
  if (Date.now() - lastSpawn > spawnRate) {
    spawnTurret();
    lastSpawn = Date.now();
    if (spawnRate > 1200) spawnRate -= 200;
  }
  player.move(inputHandler.keys);
  player.draw(ctx);
  bullets.forEach((bullet, index) => {
    bullet.move();
    if (bullet.remove) {
      bullets.splice(index, 1);
    } else {
      bullet.draw(ctx);
    }
  });
  turretBullets.forEach((bullet, index) => {
    bullet.move();
    if (bullet.remove) {
      turretBullets.splice(index, 1);
    } else {
      bullet.draw(ctx);
    }
  });
  turrets.forEach((turret) => {
    turret.shoot(player);
    turret.draw(ctx);
  });
  CollisionHandler.handleCollisions(bullets, turrets, turretBullets, player);

  // Restore the context to its original state
  ctx.restore();

  drawUI();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
