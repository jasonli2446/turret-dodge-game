import { initializeGame } from "./initializeGame.js";
import { gameLoop } from "./gameLoop.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState;

function startGame() {
  startScreen.style.display = "none";
  canvas.style.display = "block";
  gameState = initializeGame(canvas);
  gameLoop(ctx, gameState, startGame);
}

startButton.addEventListener("click", startGame);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
