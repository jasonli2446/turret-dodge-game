import { initializeGame } from "./initializeGame.js";
import { gameLoop } from "./gameLoop.js";
import { initSettingsUI } from "../ui/settings.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOverScreen");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState;

function startGame() {
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none"; // Hide game over screen
  canvas.style.display = "block";
  gameState = initializeGame(canvas);
  gameLoop(ctx, gameState, startGame);
}

initSettingsUI();

startButton.addEventListener("click", startGame);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
