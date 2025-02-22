import Turret from "../components/turret.js";
import PowerUp from "../components/powerup.js";

export function spawnTurret(gameState) {
  let elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
  let turretTypes = ["basic"];
  if (elapsedTime > 15) turretTypes.push("sniper");
  if (elapsedTime > 30) turretTypes.push("heavy");
  if (elapsedTime > 45) turretTypes.push("scatter");
  if (elapsedTime > 60) turretTypes.push("burst");
  if (elapsedTime > 75) turretTypes.push("homing");

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
  let types = ["heart", "rapidFire", "shield", "explosion"];
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
