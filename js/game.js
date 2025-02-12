const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let player;
let bullets = [];
let turrets = [];
let turretBullets = [];
let keys = {};
let spawnRate = 5000; // Every 5 seconds
let lastSpawn = Date.now();

function spawnTurret() {
  let x = Math.random() < 0.5 ? 0 : canvas.width;
  let y = Math.random() < 0.5 ? 0 : canvas.height;

  let turretTypes = ["basic", "fast", "heavy"];
  let type = turretTypes[Math.floor(Math.random() * turretTypes.length)];

  turrets.push(new Turret(x, y, type));
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Date.now() - lastSpawn > spawnRate) {
    spawnTurret();
    lastSpawn = Date.now();
    if (spawnRate > 2000) spawnRate -= 500; // Speed up difficulty
  }

  player.move(keys);
  player.draw(ctx);

  bullets.forEach((bullet, index) => {
    bullet.move();
    bullet.draw(ctx);
  });

  turretBullets.forEach((bullet, index) => {
    bullet.move();
    bullet.draw(ctx);
  });

  turrets.forEach((turret) => {
    turret.shoot(player);
    turret.draw(ctx);
  });

  handleCollisions();

  requestAnimationFrame(gameLoop);
}

// Start game
player = new Player(canvas.width / 2, canvas.height / 2);
gameLoop();
