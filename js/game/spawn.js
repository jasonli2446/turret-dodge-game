import Turret from "../components/turret.js";
import PowerUp from "../components/powerup.js";

export function spawnTurret(gameState) {
  let turretTypes = gameState.turretTypes;

  let x, y;
  do {
    x =
      Math.random() * (gameState.border.width - 100) + gameState.border.x + 50;
    y =
      Math.random() * (gameState.border.height - 100) + gameState.border.y + 50;
  } while (!isSpawnLocationValid(x, y, gameState));

  let type = turretTypes[Math.floor(Math.random() * turretTypes.length)];
  gameState.turrets.push(new Turret(x, y, type, gameState.turretBullets));
}

export function spawnPowerUp(gameState) {
  let x =
    Math.random() * (gameState.border.width - 100) + gameState.border.x + 50;
  let y =
    Math.random() * (gameState.border.height - 100) + gameState.border.y + 50;
  let types = gameState.powerUpTypes;
  let type = types[Math.floor(Math.random() * types.length)];
  gameState.powerUps.push(new PowerUp(x, y, type));
}

function isSpawnLocationValid(x, y, gameState) {
  for (let turret of gameState.turrets) {
    let dx = turret.x - x;
    let dy = turret.y - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) return false;
  }
  let dx = gameState.player.x - x;
  let dy = gameState.player.y - y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 300) return false;
  return true;
}
