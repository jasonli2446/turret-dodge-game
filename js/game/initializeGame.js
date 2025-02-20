import Player from "../components/player.js";
import InputHandler from "../components/inputHandler.js";
import { border } from "../utils/border.js";

export function initializeGame(canvas) {
  const player = new Player(
    border.x + border.width / 2,
    border.y + border.height / 2
  );
  const bullets = [];
  const turrets = [];
  const turretBullets = [];
  const powerUps = [];
  const inputHandler = new InputHandler(player, bullets, canvas);
  const spawnRate = 2500;
  const lastSpawn = Date.now();
  const lastPowerUpSpawn = Date.now();
  const startTime = Date.now();
  const gameOver = { value: false };
  const turretsDestroyed = { value: 0 };

  return {
    player,
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
    turretsDestroyed,
    border,
  };
}
