import Bullet from "./bullet.js";

class InputHandler {
  constructor(player, bullets, canvas) {
    this.keys = {};
    this.player = player;
    this.bullets = bullets;
    this.canvas = canvas;

    window.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });

    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const cameraX = player.x - canvas.width / 2;
      const cameraY = player.y - canvas.height / 2;
      const angle = Math.atan2(
        mouseY + cameraY - player.y,
        mouseX + cameraX - player.x
      );
      bullets.push(new Bullet(player.x, player.y, angle, 10, 5, true));
    });
  }
}

export default InputHandler;
