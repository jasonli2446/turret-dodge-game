import Player from "../components/player.js";
import InputHandler from "../components/inputHandler.js";
import { border } from "../utils/border.js";

// Define default settings
const DEFAULT_SETTINGS = {
  initialSpawnRate: 2500,
  maxSpawnRate: 1000,
  powerUpSpawnRate: 10000,
  playerHealth: 3,
  playerSpeed: 4,
  turretTypes: ["basic", "sniper", "heavy", "scatter", "burst", "homing"],
  powerUpTypes: ["heart", "rapidFire", "shield", "explosion", "freeze"],
};

// Check if settings match default settings
function usingDefaultSettings(settings) {
  if (!settings) return true;

  // Check numerical values
  if (settings.initialSpawnRate !== DEFAULT_SETTINGS.initialSpawnRate)
    return false;
  if (settings.maxSpawnRate !== DEFAULT_SETTINGS.maxSpawnRate) return false;
  if (settings.powerUpSpawnRate !== DEFAULT_SETTINGS.powerUpSpawnRate)
    return false;
  if (settings.playerHealth !== DEFAULT_SETTINGS.playerHealth) return false;
  if (settings.playerSpeed !== DEFAULT_SETTINGS.playerSpeed) return false;

  // Check arrays (assuming order doesn't matter, just contents)
  if (!arraysEqual(settings.turretTypes, DEFAULT_SETTINGS.turretTypes))
    return false;
  if (!arraysEqual(settings.powerUpTypes, DEFAULT_SETTINGS.powerUpTypes))
    return false;

  return true;
}

// Helper function to compare arrays regardless of order
function arraysEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
}

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
    "freeze",
  ];
  const initialSR = stored.initialSpawnRate || 2500;
  const maxSR = stored.maxSpawnRate || 1000;
  const powerUpSR = stored.powerUpSpawnRate || 15000;
  const playerHealth = stored.playerHealth || 3;
  const playerSpeed = stored.playerSpeed || 7;

  // Check if using default settings
  const isDefaultSettings = usingDefaultSettings(stored);

  // Start with only basic turrets if using default settings
  let activeTurretTypes = isDefaultSettings ? ["basic"] : turretTypes;

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
    maxSpawnRate: maxSR,
    powerUpSpawnRate: powerUpSR,
    lastSpawn: Date.now(),
    lastPowerUpSpawn: Date.now(),
    startTime: Date.now(),
    gameOver: { value: false },
    turretsDestroyed: { value: 0 },
    border,
    explosions: [],
    freezeEffects: [],
    turretTypes,
    activeTurretTypes,
    powerUpTypes,
    frozen: false,
    freezeTimeout: null,
    isDefaultSettings,
    turretUnlockSchedule: [
      { type: "sniper", unlockTime: 15 },
      { type: "heavy", unlockTime: 30 },
      { type: "scatter", unlockTime: 45 },
      { type: "burst", unlockTime: 60 },
      { type: "homing", unlockTime: 75 },
    ],
  };
}
