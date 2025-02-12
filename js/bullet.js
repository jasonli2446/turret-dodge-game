class Bullet {
  constructor(x, y, angle, speed = 5, radius = 5, canDestroy = true) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.canDestroy = canDestroy;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.canDestroy ? "red" : "darkred";
    ctx.fill();
  }
}
