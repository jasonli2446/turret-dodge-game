class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = 5;
    this.health = 3;
  }

  move(keys) {
    if (keys["w"] || keys["ArrowUp"]) this.y -= this.speed;
    if (keys["s"] || keys["ArrowDown"]) this.y += this.speed;
    if (keys["a"] || keys["ArrowLeft"]) this.x -= this.speed;
    if (keys["d"] || keys["ArrowRight"]) this.x += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}
