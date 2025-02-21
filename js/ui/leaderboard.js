export function displayLeaderboard() {
  const leaderboard = getLeaderboard();
  const leaderboardRank = document.getElementById("leaderboardRank");
  const leaderboardName = document.getElementById("leaderboardName");
  const leaderboardScore = document.getElementById("leaderboardScore");
  const leaderboardTurrets = document.getElementById("leaderboardTurrets");
  const leaderboardPopup = document.getElementById("leaderboardPopup");
  const closeLeaderboardButton = document.getElementById(
    "closeLeaderboardButton"
  );

  leaderboardRank.innerHTML = "";
  leaderboardName.innerHTML = "";
  leaderboardScore.innerHTML = "";
  leaderboardTurrets.innerHTML = "";

  // Add headers
  const headers = ["Rank", "Name", "Score", "Turrets Destroyed"];
  const headerElements = [
    leaderboardRank,
    leaderboardName,
    leaderboardScore,
    leaderboardTurrets,
  ];
  headers.forEach((header, index) => {
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("leaderboard-header");
    headerDiv.textContent = header;
    headerElements[index].appendChild(headerDiv);
  });

  // Add leaderboard entries
  leaderboard.forEach((entry, index) => {
    const rankDiv = document.createElement("div");
    const nameDiv = document.createElement("div");
    const scoreDiv = document.createElement("div");
    const turretsDiv = document.createElement("div");

    rankDiv.textContent = index + 1;
    nameDiv.textContent =
      entry.name.length > 15 ? entry.name.substring(0, 15) + "..." : entry.name;
    scoreDiv.textContent = entry.score;
    turretsDiv.textContent = entry.turretsDestroyed;

    rankDiv.classList.add("leaderboard-item");
    nameDiv.classList.add("leaderboard-item");
    scoreDiv.classList.add("leaderboard-item");
    turretsDiv.classList.add("leaderboard-item");

    leaderboardRank.appendChild(rankDiv);
    leaderboardName.appendChild(nameDiv);
    leaderboardScore.appendChild(scoreDiv);
    leaderboardTurrets.appendChild(turretsDiv);
  });

  leaderboardPopup.style.display = "flex";

  closeLeaderboardButton.onclick = () => {
    leaderboardPopup.style.display = "none";
  };
}

export function getLeaderboard() {
  const leaderboard = localStorage.getItem("leaderboard");
  return leaderboard ? JSON.parse(leaderboard) : [];
}

export function addToLeaderboard(name, score, turretsDestroyed) {
  const leaderboard = getLeaderboard();
  leaderboard.push({ name, score, turretsDestroyed });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) {
    leaderboard.pop();
  }
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}
