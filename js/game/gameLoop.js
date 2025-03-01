import CollisionHandler from "../components/collisionHandler.js";
import { drawGrid } from "../utils/grid.js";
import { drawUI } from "../ui/drawUI.js";
import { spawnTurret, spawnPowerUp } from "./spawn.js";

export function gameLoop(ctx, gameState, startGame) {
  if (gameState.gameOver.value) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  gameState.player.gameState = gameState;

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

  if (
    gameState.isDefaultSettings &&
    gameState.turretUnlockSchedule &&
    gameState.turretUnlockSchedule.length > 0
  ) {
    const elapsedSeconds = Math.floor(
      (Date.now() - gameState.startTime) / 1000
    );

    for (let i = gameState.turretUnlockSchedule.length - 1; i >= 0; i--) {
      const unlock = gameState.turretUnlockSchedule[i];
      if (elapsedSeconds >= unlock.unlockTime) {
        // If not already in active types, add it
        if (!gameState.activeTurretTypes.includes(unlock.type)) {
          gameState.activeTurretTypes.push(unlock.type);
        }

        // Remove this item from the schedule
        gameState.turretUnlockSchedule.splice(i, 1);
      }
    }
  }

  if (!gameState.frozen) {
    if (Date.now() - gameState.lastSpawn > gameState.spawnRate) {
      // Spawn turret logic
      spawnTurret(gameState);
      gameState.lastSpawn = Date.now();
      if (gameState.spawnRate > gameState.maxSpawnRate) {
        gameState.spawnRate -= 100;
      }
    }
    if (Date.now() - gameState.lastPowerUpSpawn > gameState.powerUpSpawnRate) {
      // Spawn a power-up based on the power-up spawn rate
      spawnPowerUp(gameState);
      gameState.lastPowerUpSpawn = Date.now();
    }
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
      if (explosion.isAnimated) {
        // Draw animated expanding circle with fading opacity
        const progress = Math.min(
          (currentTime - explosion.startTime) / explosion.duration,
          1
        );
        const currentRadius = explosion.maxRadius * progress;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentRadius, 0, Math.PI * 2);
        const opacity = 0.5 * (1 - progress); // Fade out as it expands
        ctx.fillStyle = `rgba(255, 125, 0, ${opacity})`;
        ctx.fill();

        // Also draw a stroke for better visibility
        ctx.strokeStyle = `rgba(255, 69, 0, ${opacity * 1.5})`;
        ctx.lineWidth = 10 * (1 - progress) + 1;
        ctx.stroke();
      } else {
        // Draw standard explosion
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 5;
        ctx.stroke();
      }
      return true;
    }
    return false;
  });

  // Draw freeze effects
  if (gameState.freezeEffects) {
    gameState.freezeEffects = gameState.freezeEffects.filter((effect) => {
      const progress = Math.min(
        (currentTime - effect.startTime) / effect.duration,
        1
      );
      const currentRadius = effect.maxRadius * progress;

      // Draw expanding circle with fading opacity
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, currentRadius, 0, Math.PI * 2);
      const opacity = 0.5 * (1 - progress); // Fade out as it expands
      ctx.fillStyle = `rgba(135, 206, 250, ${opacity})`;
      ctx.fill();

      return currentTime - effect.startTime < effect.duration;
    });
  }

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
