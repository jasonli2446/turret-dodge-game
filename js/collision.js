class CollisionHandler {
  static checkTurretCollision(circle, rect) {
    let distX = Math.abs(circle.x - rect.x - rect.size / 2);
    let distY = Math.abs(circle.y - rect.y - rect.size / 2);

    if (distX > rect.size / 2 + circle.radius) {
      return false;
    }
    if (distY > rect.size / 2 + circle.radius) {
      return false;
    }

    if (distX <= rect.size / 2) {
      return true;
    }
    if (distY <= rect.size / 2) {
      return true;
    }

    let dx = distX - rect.size / 2;
    let dy = distY - rect.size / 2;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  static checkCircleCollision(circle1, circle2) {
    let dx = circle1.x - circle2.x;
    let dy = circle1.y - circle2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
  }

  static handleCollisions(bullets, turrets, turretBullets, player) {
    // Player bullets hit turrets
    bullets.forEach((bullet, bIndex) => {
      turrets.forEach((turret, tIndex) => {
        if (CollisionHandler.checkTurretCollision(bullet, turret)) {
          bullets.splice(bIndex, 1);
          turrets.splice(tIndex, 1);
        }
      });
    });

    // Player bullets hit enemy bullets
    bullets.forEach((bullet, bIndex) => {
      turretBullets.forEach((turretBullet, tbIndex) => {
        if (CollisionHandler.checkCircleCollision(bullet, turretBullet)) {
          bullets.splice(bIndex, 1);
          turretBullets.splice(tbIndex, 1);
        }
      });
    });

    // Enemy bullets hit player
    turretBullets.forEach((bullet, bIndex) => {
      if (CollisionHandler.checkCircleCollision(bullet, player)) {
        player.health -= 1;
        turretBullets.splice(bIndex, 1);
        if (player.health <= 0) {
          displayGameOver(Math.floor((Date.now() - startTime) / 1000));
        }
      }
    });
  }
}
