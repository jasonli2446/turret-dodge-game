import {
  displayLeaderboard,
  addToLeaderboard,
  getLeaderboard,
} from "./leaderboard.js";

export function displayGameOver(score, turretsDestroyed, startGame) {
  const gameOverScreen = document.getElementById("gameOverScreen");
  const gameOverMessage = document.getElementById("gameOverMessage");
  const nameInputContainer = document.getElementById("nameInputContainer");
  const playerNameInput = document.getElementById("playerName");
  const submitNameButton = document.getElementById("submitNameButton");
  const playAgainButton = document.getElementById("playAgainButton");
  const viewLeaderboardButton = document.getElementById(
    "viewLeaderboardButton"
  );

  gameOverMessage.innerHTML = `Game Over! Score: ${
    score * 100
  }<br>Turrets Destroyed: ${turretsDestroyed}`;
  gameOverScreen.style.display = "block";

  // Check if the score is in the top 10
  const leaderboard = getLeaderboard();
  if (
    leaderboard.length < 10 ||
    score * 100 > leaderboard[leaderboard.length - 1].score
  ) {
    nameInputContainer.style.display = "block";
    submitNameButton.onclick = () => {
      const name = playerNameInput.value;
      if (name) {
        addToLeaderboard(name, score * 100, turretsDestroyed);
        nameInputContainer.style.display = "none";
        displayLeaderboard();
      }
    };
  } else {
    displayLeaderboard();
  }

  playAgainButton.onclick = () => {
    gameOverScreen.style.display = "none";
    startGame();
  };

  viewLeaderboardButton.onclick = () => {
    displayLeaderboard();
    document.getElementById("leaderboardPopup").style.display = "flex";
  };
}
