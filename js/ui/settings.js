export function initSettingsUI() {
  const customizeButton = document.getElementById("customizeButton");
  const settingsPopup = document.getElementById("settingsPopup");
  const closeSettingsButton = document.getElementById("closeSettingsButton");
  const saveSettingsButton = document.getElementById("saveSettingsButton");
  const importSettingsButton = document.getElementById("importSettingsButton");
  const exportSettingsButton = document.getElementById("exportSettingsButton");
  const revertSettingsButton = document.getElementById("revertSettingsButton");

  const advancedSettingsPopup = document.getElementById(
    "advancedSettingsPopup"
  );
  const closeAdvancedSettingsButton = document.getElementById(
    "closeAdvancedSettingsButton"
  );
  const exportOutput = document.getElementById("exportOutput");
  const copyExportButton = document.getElementById("copyExportButton");

  const turretSelectionContainer = document.getElementById(
    "turretSelectionContainer"
  );
  const powerupSelectionContainer = document.getElementById(
    "powerupSelectionContainer"
  );

  customizeButton.onclick = () => {
    settingsPopup.style.display = "flex";
    loadSettingsToForm();
  };

  closeSettingsButton.onclick = () => {
    settingsPopup.style.display = "none";
  };

  saveSettingsButton.onclick = () => {
    if (validateSettings()) {
      saveFormToLocalStorage();
      settingsPopup.style.display = "none";
    } else {
      alert("Please select at least one turret type.");
    }
  };

  importSettingsButton.onclick = () => {
    const json = prompt("Paste your settings JSON:");
    if (json) {
      localStorage.setItem("gameSettings", json);
      loadSettingsToForm();
      alert("Settings Imported!");
    }
  };

  exportSettingsButton.onclick = () => {
    settingsPopup.style.display = "none";
    advancedSettingsPopup.style.display = "flex";
    showExportOutput();
  };

  closeAdvancedSettingsButton.onclick = () => {
    advancedSettingsPopup.style.display = "none";
    settingsPopup.style.display = "flex";
  };

  copyExportButton.onclick = () => {
    exportOutput.select();
    document.execCommand("copy");
    copyExportButton.textContent = "Copied!";
    setTimeout(() => {
      copyExportButton.textContent = "Copy";
    }, 1500);
  };

  revertSettingsButton.onclick = () => {
    localStorage.removeItem("gameSettings");
    loadSettingsToForm();
  };

  turretSelectionContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("turret-option")) {
      e.target.classList.toggle("selected");
      saveAdvancedSelections();
    }
  });

  powerupSelectionContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("powerup-option") ||
      e.target.parentNode.classList.contains("powerup-option")
    ) {
      const option = e.target.classList.contains("powerup-option")
        ? e.target
        : e.target.parentNode;
      option.classList.toggle("selected");
      saveAdvancedSelections();
    }
  });

  const initialSpawnRateInput = document.getElementById(
    "initialSpawnRateInput"
  );
  const maxSpawnRateInput = document.getElementById("maxSpawnRateInput");
  const powerUpSpawnRateInput = document.getElementById(
    "powerUpSpawnRateInput"
  );
  const playerHealthInput = document.getElementById("playerHealthInput");
  const playerSpeedInput = document.getElementById("playerSpeedInput");

  initialSpawnRateInput.oninput = () => {
    document.getElementById("initialSpawnRateValue").textContent =
      initialSpawnRateInput.value;
    if (
      parseInt(maxSpawnRateInput.value) > parseInt(initialSpawnRateInput.value)
    ) {
      maxSpawnRateInput.value = initialSpawnRateInput.value;
      document.getElementById("maxSpawnRateValue").textContent =
        maxSpawnRateInput.value;
    }
  };

  maxSpawnRateInput.oninput = () => {
    document.getElementById("maxSpawnRateValue").textContent =
      maxSpawnRateInput.value;
    if (
      parseInt(maxSpawnRateInput.value) > parseInt(initialSpawnRateInput.value)
    ) {
      maxSpawnRateInput.value = initialSpawnRateInput.value;
      document.getElementById("maxSpawnRateValue").textContent =
        maxSpawnRateInput.value;
    }
  };
  powerUpSpawnRateInput.oninput = () => {
    document.getElementById("powerUpSpawnRateValue").textContent =
      powerUpSpawnRateInput.value;
  };
  playerHealthInput.oninput = () => {
    document.getElementById("playerHealthValue").textContent =
      playerHealthInput.value;
  };
  playerSpeedInput.oninput = () => {
    document.getElementById("playerSpeedValue").textContent =
      playerSpeedInput.value;
  };
}

function loadSettingsToForm() {
  const stored = JSON.parse(localStorage.getItem("gameSettings") || "{}");
  document.getElementById("initialSpawnRateInput").value =
    stored.initialSpawnRate || 2500;
  document.getElementById("maxSpawnRateInput").value =
    stored.maxSpawnRate || 1000;
  document.getElementById("powerUpSpawnRateInput").value =
    stored.powerUpSpawnRate || 15000;
  document.getElementById("playerHealthInput").value = stored.playerHealth || 3;
  document.getElementById("playerSpeedInput").value = stored.playerSpeed || 5;

  document.getElementById("initialSpawnRateValue").textContent =
    stored.initialSpawnRate || 2500;
  document.getElementById("maxSpawnRateValue").textContent =
    stored.maxSpawnRate || 1000;
  document.getElementById("powerUpSpawnRateValue").textContent =
    stored.powerUpSpawnRate || 15000;
  document.getElementById("playerHealthValue").textContent =
    stored.playerHealth || 3;
  document.getElementById("playerSpeedValue").textContent =
    stored.playerSpeed || 5;

  const turretTypes = stored.turretTypes || [
    "basic",
    "sniper",
    "heavy",
    "scatter",
    "burst",
    "homing",
  ];
  const powerUpTypes = stored.powerUpTypes || [
    "heart",
    "rapidFire",
    "shield",
    "explosion",
    "freeze",
  ];

  Array.from(document.querySelectorAll(".turret-option")).forEach((option) => {
    const type = option.getAttribute("data-type");
    if (turretTypes.includes(type)) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });

  Array.from(document.querySelectorAll(".powerup-option")).forEach((option) => {
    const type = option.getAttribute("data-type");
    if (powerUpTypes.includes(type)) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });
}

function saveFormToLocalStorage() {
  const newSettings = {
    initialSpawnRate: parseInt(
      document.getElementById("initialSpawnRateInput").value
    ),
    maxSpawnRate: parseInt(document.getElementById("maxSpawnRateInput").value),
    powerUpSpawnRate: parseInt(
      document.getElementById("powerUpSpawnRateInput").value
    ),
    playerHealth: parseInt(document.getElementById("playerHealthInput").value),
    playerSpeed: parseFloat(document.getElementById("playerSpeedInput").value),
    turretTypes: Array.from(
      document.querySelectorAll(".turret-option.selected")
    ).map((el) => el.getAttribute("data-type")),
    powerUpTypes: Array.from(
      document.querySelectorAll(".powerup-option.selected")
    ).map((el) => el.getAttribute("data-type")),
  };
  localStorage.setItem("gameSettings", JSON.stringify(newSettings));
}

function saveAdvancedSelections() {
  const selectedTurrets = Array.from(
    document.querySelectorAll(".turret-option.selected")
  ).map((el) => el.getAttribute("data-type"));
  const selectedPowerUps = Array.from(
    document.querySelectorAll(".powerup-option.selected")
  ).map((el) => el.getAttribute("data-type"));

  const stored = JSON.parse(localStorage.getItem("gameSettings") || "{}");
  stored.turretTypes = selectedTurrets;
  stored.powerUpTypes = selectedPowerUps;
  localStorage.setItem("gameSettings", JSON.stringify(stored));
  showExportOutput();
}

function showExportOutput() {
  const settings = localStorage.getItem("gameSettings") || "{}";
  const exportOutput = document.getElementById("exportOutput");
  exportOutput.value = settings;
}

function validateSettings() {
  const selectedTurrets = Array.from(
    document.querySelectorAll(".turret-option.selected")
  );
  return selectedTurrets.length > 0;
}
