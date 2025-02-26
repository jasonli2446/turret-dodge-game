import Bullet from "./bullet.js";

class InputHandler {
  constructor(player, bullets, canvas) {
    this.keys = {};
    this.player = player;
    this.bullets = bullets;
    this.canvas = canvas;
    this.shooting = false;

    window.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
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
      new Bullet(this.player.x, this.player.y, angle, 10, 5, true)
    );
  }
}

export default InputHandler;
