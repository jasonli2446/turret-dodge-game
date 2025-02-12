const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = new Player(canvas.width / 2, canvas.height / 2);
let bullets = [];
let turrets = [];
let turretBullets = [];
let inputHandler = new InputHandler(player, bullets);
let spawnRate = 5000;
let lastSpawn = Date.now();
let startTime = Date.now();
let gameOver = false;

function isSpawnLocationValid(x, y) {
  // Ensures turrets don't overlap
  for (let turret of turrets) {
    let dx = turret.x - x;
    let dy = turret.y - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) return false;
  }
  // Ensure turrets don't spawn too close to the player
  let dx = player.x - x;
  let dy = player.y - y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 100) return false;

  return true;
}

function spawnTurret() {
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  let turretTypes = ["basic"];

  if (elapsedTime > 10) turretTypes.push("fast");
  if (elapsedTime > 20) turretTypes.push("heavy");

  let x, y;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
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
    ctx.fillRect(10 + i * 25, 50, 20, 20);
  }
}

function displayGameOver(score) {
  gameOver = true;
  const scoreElement = document.createElement("div");
  scoreElement.id = "gameOver";
  scoreElement.innerHTML = `Game Over! Score: ${score * 100}`;
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
    if (spawnRate > 2000) spawnRate -= 300;
  }

  player.move(inputHandler.keys);
  player.draw(ctx);

  bullets.forEach((bullet) => {
    bullet.move();
    bullet.draw(ctx);
  });

  turretBullets.forEach((bullet) => {
    bullet.move();
    bullet.draw(ctx);
  });

  turrets.forEach((turret) => {
    turret.shoot(player);
    turret.draw(ctx);
  });

  CollisionHandler.handleCollisions(bullets, turrets, turretBullets, player);
  drawUI();

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("mousedown", (event) => {
  let rect = canvas.getBoundingClientRect();
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;

  let angle = Math.atan2(mouseY - player.y, mouseX - player.x);
  bullets.push(new Bullet(player.x, player.y, angle, 7, 5, true));
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Start game
gameLoop();
