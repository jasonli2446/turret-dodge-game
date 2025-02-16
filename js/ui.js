export function drawUI(ctx, player, startTime) {
  let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Time Survived: ${elapsedTime}s`, 10, 30);
  for (let i = 0; i < player.health; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(10 + i * 25, 60, 20, 20);
  }
}

export function displayGameOver(score, turretsDestroyed, startGame) {
  const gameOverElement = document.createElement("div");
  gameOverElement.id = "gameOver";
  gameOverElement.innerHTML = `Game Over! Score: ${
    score * 100
  }<br>Turrets Destroyed: ${turretsDestroyed}`;
  document.body.appendChild(gameOverElement);

  const playAgainButton = document.createElement("button");
  playAgainButton.id = "playAgain";
  playAgainButton.innerHTML = "Play Again";
  playAgainButton.onclick = () => {
    document.body.removeChild(gameOverElement);
    document.body.removeChild(playAgainButton);
    startGame();
  };
  document.body.appendChild(playAgainButton);
}
