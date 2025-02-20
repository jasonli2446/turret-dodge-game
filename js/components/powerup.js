class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.type = type;
    this.image = new Image();
    if (type === "heart") {
      this.image.src = "assets/images/heart.webp";
    } else if (type === "rapidFire") {
      this.image.src = "assets/images/lightning.png";
    } else if (type === "shield") {
      this.image.src = "assets/images/shield.png";
    } else if (type === "explosion") {
      this.image.src = "assets/images/explosion.png";
    }
  }

  draw(ctx) {
    const size = this.type === "shield" ? 60 : 30;
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      size,
      size
    );
  }

  applyEffect(player, turrets, turretBullets, ctx, gameState) {
    if (this.type === "heart") {
      player.health += 1;
    } else if (this.type === "rapidFire") {
      player.activateRapidFire(5000);
    } else if (this.type === "shield") {
      player.activateShield(5000);
    } else if (this.type === "explosion") {
      const explosionRadius = 800;
      const explosionStartTime = Date.now();

      // Add explosion effect to gameState
      gameState.explosions.push({
        x: player.x,
        y: player.y,
        radius: explosionRadius,
        startTime: explosionStartTime,
        duration: 1000,
      });

      for (let i = turrets.length - 1; i >= 0; i--) {
        const dx = turrets[i].x - player.x;
        const dy = turrets[i].y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= explosionRadius) {
          turrets.splice(i, 1);
        }
      }
      for (let i = turretBullets.length - 1; i >= 0; i--) {
        const dx = turretBullets[i].x - player.x;
        const dy = turretBullets[i].y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= explosionRadius) {
          turretBullets.splice(i, 1);
        }
      }
    }
  }
}

export default PowerUp;
