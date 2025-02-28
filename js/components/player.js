import { border } from "../utils/border.js";

export default class Player {
  constructor(x, y, health = 3, speed = 5) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = speed;
    this.health = health;
    this.rapidFire = false;
    this.shielded = false;
    this.powerUpTimers = {};
    // Dash properties
    this.dashSpeed = this.speed * 2; // Dash speed multiplier
    this.dashLength = 150; // How far to dash
    this.dashCooldown = 1000; // Cooldown in milliseconds
    this.lastDashTime = 0;
    this.isDashing = false;
    this.dashDirection = { x: 0, y: 0 }; // Direction of dash
    this.dashDistance = 0; // Distance traveled during dash
  }

  move(keys) {
    // Handle normal movement
    let moveX = 0;
    let moveY = 0;

    if (keys["w"] || keys["ArrowUp"]) moveY -= 1;
    if (keys["s"] || keys["ArrowDown"]) moveY += 1;
    if (keys["a"] || keys["ArrowLeft"]) moveX -= 1;
    if (keys["d"] || keys["ArrowRight"]) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
      moveX /= magnitude;
      moveY /= magnitude;
    }

    // Handle dash movement
    if (this.isDashing) {
      this.x += this.dashDirection.x * this.dashSpeed;
      this.y += this.dashDirection.y * this.dashSpeed;

      this.dashDistance += this.dashSpeed;

      if (this.dashDistance >= this.dashLength) {
        this.isDashing = false;
        this.dashDistance = 0;
      }
    } else {
      // Normal movement
      this.x += moveX * this.speed;
      this.y += moveY * this.speed;
    }

    // Prevent player from moving outside the border
    if (this.x - this.radius < border.x) this.x = border.x + this.radius;
    if (this.x + this.radius > border.x + border.width)
      this.x = border.x + border.width - this.radius;
    if (this.y - this.radius < border.y) this.y = border.y + this.radius;
    if (this.y + this.radius > border.y + border.height)
      this.y = border.y + border.height - this.radius;
  }

  dash(keys) {
    const currentTime = Date.now();
    if (currentTime - this.lastDashTime < this.dashCooldown || this.isDashing) {
      return; // Still on cooldown or already dashing
    }

    // Determine dash direction based on current movement keys
    let dirX = 0;
    let dirY = 0;

    if (keys["w"] || keys["ArrowUp"]) dirY -= 1;
    if (keys["s"] || keys["ArrowDown"]) dirY += 1;
    if (keys["a"] || keys["ArrowLeft"]) dirX -= 1;
    if (keys["d"] || keys["ArrowRight"]) dirX += 1;

    // If no direction keys are pressed, dash forward (based on last movement)
    if (dirX === 0 && dirY === 0) {
      // Default to dashing right if no direction
      dirX = 1;
    }

    // Normalize the direction vector
    const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    this.dashDirection = {
      x: dirX / magnitude,
      y: dirY / magnitude,
    };

    this.isDashing = true;
    this.lastDashTime = currentTime;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Change player color when dashing
    if (this.isDashing) {
      ctx.fillStyle = "lightblue";
    } else {
      ctx.fillStyle = "blue";
    }
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
