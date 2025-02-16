class Turret {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 30;
    this.lastShot = 0;

    if (type === "basic") {
      this.fireRate = 2000;
      this.bulletSpeed = 3;
      this.bulletSize = 5;
    } else if (type === "fast") {
      this.fireRate = 1000;
      this.bulletSpeed = 8;
      this.bulletSize = 5;
    } else if (type === "heavy") {
      this.fireRate = 3000;
      this.bulletSpeed = 2;
      this.bulletSize = 15;
    }
  }

  shoot(player) {
    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    if (Date.now() - this.lastShot > this.fireRate) {
      turretBullets.push(
        new Bullet(
          this.x,
          this.y,
          angle,
          this.bulletSpeed,
          this.bulletSize,
          false
        )
      );
      this.lastShot = Date.now();
    }
  }

  draw(ctx) {
    ctx.fillStyle =
      this.type === "basic"
        ? "green"
        : this.type === "fast"
        ? "orange"
        : "purple";
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
