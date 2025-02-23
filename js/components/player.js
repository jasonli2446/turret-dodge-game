import { border } from "../utils/border.js";

export default class Player {
  constructor(x, y, health = 3, speed = 3) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = speed;
    this.health = health;
    this.rapidFire = false;
    this.shielded = false;
    this.powerUpTimers = {};
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

    // Draw shield if active
    if (this.shielded) {
      const timeLeft = this.powerUpTimers.shielded.endTime - Date.now();
      const opacity =
        timeLeft < 2000 ? Math.abs(Math.sin(Date.now() / 100)) : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  activatePowerUp(type, duration) {
    if (this.powerUpTimers[type]) {
      clearTimeout(this.powerUpTimers[type].timeout);
    }
    this.powerUpTimers[type] = {
      endTime: Date.now() + duration,
      timeout: setTimeout(() => {
        this[type] = false;
        delete this.powerUpTimers[type];
      }, duration),
    };
    this[type] = true;
  }

  activateRapidFire(duration) {
    this.activatePowerUp("rapidFire", duration);
  }

  activateShield(duration) {
    this.activatePowerUp("shielded", duration);
  }
}
