export function drawGrid(ctx, border) {
  const gridSize = 50;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;

  for (let x = border.x; x <= border.x + border.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, border.y);
    ctx.lineTo(x, border.y + border.height);
    ctx.stroke();
  }

  for (let y = border.y; y <= border.y + border.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(border.x, y);
    ctx.lineTo(border.x + border.width, y);
    ctx.stroke();
  }
}
