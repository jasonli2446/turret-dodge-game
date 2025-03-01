import {
  displayLeaderboard,
  addToLeaderboard,
  getLeaderboard,
} from "./leaderboard.js";

export function displayGameOver(
  score,
  turretsDestroyed,
  startGame,
  isDefaultSettings = false
) {
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

  // Remove any existing custom settings message
  const existingMessage = document.getElementById("customSettingsMessage");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Check if the score is in the top 10 AND using default settings
  const leaderboard = getLeaderboard();
  if (
    isDefaultSettings &&
    (leaderboard.length < 10 ||
      score * 100 > leaderboard[leaderboard.length - 1].score)
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
    nameInputContainer.style.display = "none";

    // If custom settings were used, display a message
    if (!isDefaultSettings) {
      const customSettingsMessage = document.createElement("p");
      customSettingsMessage.id = "customSettingsMessage";
      customSettingsMessage.textContent =
        "Note: Custom settings were used, so this score is not eligible for the leaderboard.";
      customSettingsMessage.style.color = "yellow";
      customSettingsMessage.style.fontSize = "16px";
      customSettingsMessage.style.margin = "10px 0";

      // Insert the message after gameOverMessage
      gameOverMessage.parentNode.insertBefore(
        customSettingsMessage,
        gameOverMessage.nextSibling
      );
    }

    displayLeaderboard();
  }

  playAgainButton.onclick = startGame;
  viewLeaderboardButton.onclick = displayLeaderboard;
}
