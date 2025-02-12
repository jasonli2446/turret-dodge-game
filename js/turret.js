class Turret {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // "basic", "fast", "heavy"
    this.lastShot = 0;

    if (type === "basic") {
      this.fireRate = 1000; // 1 shot per second
      this.bulletSpeed = 3;
      this.bulletSize = 5;
      this.canDestroyBullets = true;
    } else if (type === "fast") {
      this.fireRate = 500; // 2 shots per second
      this.bulletSpeed = 5;
      this.bulletSize = 4;
      this.canDestroyBullets = true;
    } else if (type === "heavy") {
      this.fireRate = 1500; // Slower fire rate
      this.bulletSpeed = 2;
      this.bulletSize = 10;
      this.canDestroyBullets = false;
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
          this.canDestroyBullets
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
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }
}
