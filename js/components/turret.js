import Bullet from "./bullet.js";

class Turret {
  constructor(x, y, type, turretBullets) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 30;
    this.lastShot = 0;
    this.turretBullets = turretBullets;
    this.frozen = false;

    switch (type) {
      case "basic":
        this.fireRate = 2000;
        this.bulletSpeed = 1.5;
        this.bulletSize = 5;
        this.color = "green";
        break;
      case "sniper":
        this.fireRate = 5000;
        this.bulletSpeed = 6;
        this.bulletSize = 5;
        this.color = "orange";
        break;
      case "heavy":
        this.fireRate = 3000;
        this.bulletSpeed = 1;
        this.bulletSize = 15;
        this.color = "purple";
        break;
      case "scatter":
        this.fireRate = 1500;
        this.bulletSpeed = 3;
        this.bulletSize = 5;
        this.color = "yellow";
        break;
      case "burst":
        this.fireRate = 3000;
        this.bulletSpeed = 4;
        this.bulletSize = 5;
        this.color = "pink";
        this.burstCount = 3;
        this.burstInterval = 150;
        break;
      case "homing":
        this.fireRate = 4000;
        this.bulletSpeed = 2;
        this.bulletSize = 5;
        this.color = "brown";
        break;
      default:
        this.color = "gray"; // Default color for unknown types
    }
  }

  shoot(player) {
    if (this.frozen) return; // Skip shooting if frozen

    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    if (Date.now() - this.lastShot > this.fireRate) {
      if (this.type === "scatter") {
        for (let i = -1; i <= 1; i++) {
          this.turretBullets.push(
            new Bullet(
              this.x,
              this.y,
              angle + i * 0.2,
              this.bulletSpeed,
              this.bulletSize,
              false,
              false,
              this.type
            )
          );
        }
      } else if (this.type === "burst") {
        for (let i = 0; i < this.burstCount; i++) {
          setTimeout(() => {
            this.turretBullets.push(
              new Bullet(
                this.x,
                this.y,
                angle,
                this.bulletSpeed,
                this.bulletSize,
                false,
                false,
                this.type
              )
            );
          }, i * this.burstInterval);
        }
      } else if (this.type === "homing") {
        this.turretBullets.push(
          new Bullet(
            this.x,
            this.y,
            angle,
            this.bulletSpeed,
            this.bulletSize,
            false,
            true,
            this.type
          )
        );
      } else {
        this.turretBullets.push(
          new Bullet(
            this.x,
            this.y,
            angle,
            this.bulletSpeed,
            this.bulletSize,
            false,
            false,
            this.type
          )
        );
      }
      this.lastShot = Date.now();
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export default Turret;
