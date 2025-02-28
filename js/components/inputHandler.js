import Bullet from "./bullet.js";

class InputHandler {
  constructor(player, bullets, canvas) {
    this.keys = {};
    this.player = player;
    this.bullets = bullets;
    this.canvas = canvas;
    this.shooting = false;
    this.lastSpacePress = 0; // Prevent repeated space bar triggers

    window.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;

      // Handle space bar for dash
      if (event.key === " " || event.code === "Space") {
        // Prevent repeated triggers from key being held down
        const now = Date.now();
        if (now - this.lastSpacePress > 200) {
          // Small buffer to prevent double-triggering
          this.player.dash(this.keys);
          this.lastSpacePress = now;
        }
        event.preventDefault(); // Prevent page scrolling with space
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });

    canvas.addEventListener("mousedown", (event) => {
      this.shooting = true;
      this.shoot(event);
    });

    canvas.addEventListener("mouseup", () => {
      this.shooting = false;
    });

    canvas.addEventListener("mousemove", (event) => {
      if (this.shooting && this.player.rapidFire) {
        this.shoot(event);
      }
    });
  }

  shoot(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const cameraX = this.player.x - this.canvas.width / 2;
    const cameraY = this.player.y - this.canvas.height / 2;
    const angle = Math.atan2(
      mouseY + cameraY - this.player.y,
      mouseX + cameraX - this.player.x
    );
    this.bullets.push(
      new Bullet(this.player.x, this.player.y, angle, 12, 5, true)
    );
  }
}

export default InputHandler;
