const heartImage = new Image();
heartImage.src = "assets/images/heart.webp";

export function drawUI(ctx, player, startTime) {
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Time Survived: ${elapsedTime}s`, 10, 30);

  if (heartImage.complete) {
    for (let i = 0; i < player.health; i++) {
      ctx.drawImage(heartImage, 10 + i * 35, 40, 30, 30);
    }
  } else {
    heartImage.onload = () => {
      for (let i = 0; i < player.health; i++) {
        ctx.drawImage(heartImage, 10 + i * 35, 40, 30, 30);
      }
    };
  }
}
