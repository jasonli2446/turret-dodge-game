class InputHandler {
  constructor(player, bullets) {
    this.keys = {};
    this.player = player;
    this.bullets = bullets;

    window.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });

    canvas.addEventListener("click", (event) => {
      const angle = Math.atan2(
        event.clientY - this.player.y,
        event.clientX - this.player.x
      );
    });
  }
}
