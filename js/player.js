import { border } from "./utils/border.js";

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = 5;
    this.health = 3;
    this.rapidFire = false;
  }

  move(keys) {
    if (keys["w"] || keys["ArrowUp"]) this.y -= this.speed;
    if (keys["s"] || keys["ArrowDown"]) this.y += this.speed;
    if (keys["a"] || keys["ArrowLeft"]) this.x -= this.speed;
    if (keys["d"] || keys["ArrowRight"]) this.x += this.speed;

    // Prevent player from moving outside the border
    if (this.x - this.radius < border.x) this.x = border.x + this.radius;
    if (this.x + this.radius > border.x + border.width)
      this.x = border.x + border.width - this.radius;
    if (this.y - this.radius < border.y) this.y = border.y + this.radius;
    if (this.y + this.radius > border.y + border.height)
      this.y = border.y + border.height - this.radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  }
}

export default Player;
