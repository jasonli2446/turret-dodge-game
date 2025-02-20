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
  };
}

function getLeaderboard() {
  const leaderboard = localStorage.getItem("leaderboard");
  return leaderboard ? JSON.parse(leaderboard) : [];
}

function addToLeaderboard(name, score, turretsDestroyed) {
  const leaderboard = getLeaderboard();
  leaderboard.push({ name, score, turretsDestroyed });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) {
    leaderboard.pop();
  }
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const leaderboardPopup = document.getElementById("leaderboardPopup");
  const leaderboardList = document.getElementById("leaderboardList");
  const closeLeaderboardButton = document.getElementById(
    "closeLeaderboardButton"
  );

  leaderboardList.innerHTML = "";
  leaderboard.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${entry.name}: ${
      entry.score
    } (Turrets Destroyed: ${entry.turretsDestroyed})`;
    leaderboardList.appendChild(listItem);
  });

  leaderboardPopup.style.display = "flex";

  closeLeaderboardButton.onclick = () => {
    leaderboardPopup.style.display = "none";
  };
}
