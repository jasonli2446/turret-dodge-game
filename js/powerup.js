class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.type = type;
    this.image = new Image();
    if (type === "heart") {
      this.image.src = "assets/images/heart.webp";
    }
    // Add more types and their corresponding images here
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      30,
      30
    );
  }

  applyEffect(player) {
    if (this.type === "heart") {
      player.health += 1;
    }
    // Add more effects for other types here
  }
}

export default PowerUp;
