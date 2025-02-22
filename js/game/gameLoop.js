import CollisionHandler from "../components/collisionHandler.js";
import { drawGrid } from "../utils/grid.js";
import { drawUI } from "../ui/drawUI.js";
import { spawnTurret, spawnPowerUp } from "./spawn.js";

export function gameLoop(ctx, gameState, startGame) {
  if (gameState.gameOver.value) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Calculate camera offset
  const cameraX = gameState.player.x - ctx.canvas.width / 2;
  const cameraY = gameState.player.y - ctx.canvas.height / 2;

  // Save the current context state
  ctx.save();

  // Translate the context to center the player
  ctx.translate(-cameraX, -cameraY);

  // Draw grid
  drawGrid(ctx, gameState.border);

  // Draw border
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.strokeRect(
    gameState.border.x,
    gameState.border.y,
    gameState.border.width,
    gameState.border.height
  );

  if (Date.now() - gameState.lastSpawn > gameState.spawnRate) {
    // Spawn turret logic
    spawnTurret(gameState);
    gameState.lastSpawn = Date.now();
    if (gameState.spawnRate > 1000) gameState.spawnRate -= 100;
  }
  if (Date.now() - gameState.lastPowerUpSpawn > 15000) {
    // Spawn a power-up every 15 seconds
    spawnPowerUp(gameState);
    gameState.lastPowerUpSpawn = Date.now();
  }
  gameState.player.move(gameState.inputHandler.keys);
  gameState.player.draw(ctx);
  gameState.bullets.forEach((bullet, index) => {
    bullet.move(gameState.player);
    if (bullet.remove) {
      gameState.bullets.splice(index, 1);
    } else {
      bullet.draw(ctx);
    }
  });
  gameState.turretBullets.forEach((bullet, index) => {
    bullet.move(gameState.player);
    if (bullet.remove) {
      gameState.turretBullets.splice(index, 1);
    } else {
      bullet.draw(ctx);
    }
  });
  gameState.turrets.forEach((turret, tIndex) => {
    turret.shoot(gameState.player);
    turret.draw(ctx);
  });
  gameState.powerUps.forEach((powerUp, index) => {
    powerUp.draw(ctx);
    if (CollisionHandler.checkCircleCollision(gameState.player, powerUp)) {
      powerUp.applyEffect(
        gameState.player,
        gameState.turrets,
        gameState.turretBullets,
        ctx,
        gameState
      );
      gameState.powerUps.splice(index, 1);
    }
  });

  // Draw explosions
  const currentTime = Date.now();
  gameState.explosions = gameState.explosions.filter((explosion) => {
    if (currentTime - explosion.startTime < explosion.duration) {
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 5;
      ctx.stroke();
      return true;
    }
    return false;
  });

  CollisionHandler.handleCollisions(
    gameState.bullets,
    gameState.turrets,
    gameState.turretBullets,
    gameState.player,
    gameState.turretsDestroyed,
    gameState.startTime,
    gameState.gameOver,
    startGame
  );

  // Restore the context to its original state
  ctx.restore();

  drawUI(ctx, gameState.player, gameState.startTime);
  requestAnimationFrame(() => gameLoop(ctx, gameState, startGame));
}
