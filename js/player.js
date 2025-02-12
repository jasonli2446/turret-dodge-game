class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = 3;
    this.health = 3;
  }

  move(keys) {
    if (keys["w"] && this.y > this.radius) this.y -= this.speed;
    if (keys["s"] && this.y < canvas.height - this.radius) this.y += this.speed;
    if (keys["a"] && this.x > this.radius) this.x -= this.speed;
    if (keys["d"] && this.x < canvas.width - this.radius) this.x += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    // Draw hearts
    for (let i = 0; i < this.health; i++) {
      ctx.fillStyle = "red";
      ctx.fillRect(10 + i * 25, 10, 20, 20);
    }
  }
}
