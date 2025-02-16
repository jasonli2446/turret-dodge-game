import { border } from "./utils/border.js";

class Bullet {
  constructor(x, y, angle, speed = 5, radius = 5, isPlayerBullet = false) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
    this.isPlayerBullet = isPlayerBullet;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    // Check for border collisions
    if (
      this.x - this.radius < border.x ||
      this.x + this.radius > border.x + border.width ||
      this.y - this.radius < border.y ||
      this.y + this.radius > border.y + border.height
    ) {
      this.remove = true;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isPlayerBullet ? "cyan" : "red";
    ctx.fill();
  }
}

export default Bullet;
