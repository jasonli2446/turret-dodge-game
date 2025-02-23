import Player from "../components/player.js";
import InputHandler from "../components/inputHandler.js";
import { border } from "../utils/border.js";

export function initializeGame(canvas) {
  // (1) Load settings
  const stored = JSON.parse(localStorage.getItem("gameSettings") || "{}");
  const turretTypes = stored.turretTypes || [
    "basic",
    "sniper",
    "heavy",
    "scatter",
    "burst",
    "homing",
  ];
  const powerUpTypes = stored.powerUpTypes || [
    "heart",
    "rapidFire",
    "shield",
    "explosion",
  ];
  const initialSR = stored.initialSpawnRate || 2500;
  const maxSR = stored.maxSpawnRate || 1000;
  const powerUpSR = stored.powerUpSpawnRate || 15000;
  const playerHealth = stored.playerHealth || 3;
  const playerSpeed = stored.playerSpeed || 5;

  // (2) Create player with custom health & speed
  const player = new Player(
    border.x + border.width / 2,
    border.y + border.height / 2,
    playerHealth,
    playerSpeed
  );

  // (3) Prepare state
  const bullets = [];
  const turrets = [];
  const turretBullets = [];
  const powerUps = [];
  const inputHandler = new InputHandler(player, bullets, canvas);

  // (4) Return game state
  return {
    player,
    bullets,
    turrets,
    turretBullets,
    powerUps,
    inputHandler,
    spawnRate: initialSR,
    maxSpawnRate: maxSR, // custom property
    powerUpSpawnRate: powerUpSR, // custom property
    lastSpawn: Date.now(),
    lastPowerUpSpawn: Date.now(),
    startTime: Date.now(),
    gameOver: { value: false },
    turretsDestroyed: { value: 0 },
    border,
    explosions: [],
    turretTypes, // pass these to your spawn logic
    powerUpTypes, // pass these to your spawn logic
  };
}
