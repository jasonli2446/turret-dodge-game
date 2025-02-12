function checkCollision(circle1, circle2) {
  let dx = circle1.x - circle2.x;
  let dy = circle1.y - circle2.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

function handleCollisions() {
  // Player bullets hit turrets
  bullets.forEach((bullet, bIndex) => {
    turrets.forEach((turret, tIndex) => {
      if (checkCollision(bullet, turret)) {
        bullets.splice(bIndex, 1);
        turrets.splice(tIndex, 1);
      }
    });
  });

  // Enemy bullets hit player
  turretBullets.forEach((bullet, bIndex) => {
    if (checkCollision(bullet, player)) {
      player.health -= 1;
      turretBullets.splice(bIndex, 1);
      if (player.health <= 0) {
        alert("Game Over!");
        window.location.reload();
      }
    }
  });
}
