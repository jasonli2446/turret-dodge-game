import Player from "./player.js";
import Turret from "./turret.js";
import Bullet from "./bullet.js";
import PowerUp from "./powerup.js";
import InputHandler from "./input.js";
import CollisionHandler from "./collision.js";
import { drawGrid } from "./utils/grid.js";
import { border } from "./utils/border.js";
import { drawUI, displayGameOver } from "./ui.js";

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
  powerUps,
  inputHandler,
  spawnRate,
  lastSpawn,
  lastPowerUpSpawn,
  startTime,
  gameOver,
  turretsDestroyed;

function initializeGame() {
  player = new Player(
    border.x + border.width / 2,
    border.y + border.height / 2
  );
  bullets = [];
  turrets = [];
  turretBullets = [];
  powerUps = [];
  inputHandler = new InputHandler(player, bullets, canvas);
  spawnRate = 3000;
  lastSpawn = Date.now();
  lastPowerUpSpawn = Date.now();
  startTime = Date.now();
  gameOver = { value: false };
  turretsDestroyed = { value: 0 };
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
  turrets.push(new Turret(x, y, type, turretBullets));
}

function spawnPowerUp() {
  let x = Math.random() * (border.width - 100) + border.x + 50;
  let y = Math.random() * (border.height - 100) + border.y + 50;
  let types = ["heart", "rapidFire"];
  let type = types[Math.floor(Math.random() * types.length)];
  powerUps.push(new PowerUp(x, y, type));
}

function gameLoop() {
  if (gameOver.value) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate camera offset
  const cameraX = player.x - canvas.width / 2;
  const cameraY = player.y - canvas.height / 2;

  // Save the current context state
  ctx.save();

  // Translate the context to center the player
  ctx.translate(-cameraX, -cameraY);

  // Draw grid
  drawGrid(ctx, border);

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
  if (Date.now() - lastPowerUpSpawn > 10000) {
    // Spawn a power-up every 10 seconds
    spawnPowerUp();
    lastPowerUpSpawn = Date.now();
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
  powerUps.forEach((powerUp, index) => {
    powerUp.draw(ctx);
    if (CollisionHandler.checkCircleCollision(player, powerUp)) {
      powerUp.applyEffect(player);
      powerUps.splice(index, 1);
    }
  });
  CollisionHandler.handleCollisions(
    bullets,
    turrets,
    turretBullets,
    player,
    turretsDestroyed,
    startTime,
    gameOver,
    startGame
  );

  // Restore the context to its original state
  ctx.restore();

  drawUI(ctx, player, startTime);
  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
