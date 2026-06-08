// Game logic functions

function endSession() {
    clearInterval(sessionTimer);
    gameActive = false;
    
    const total = correct + wrong;
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    
    resultsScore.textContent = `Score: ${score}`;
    resultsAccuracy.textContent = `Accuracy: ${pct}%`;
    resultsLevel.textContent = `Level reached: ${level}`;
    resultsBest.textContent = `Best score: ${bestScore}`;
    
    recordWeeklyRun(score, level, pct);
    
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    restartBtn.style.display = "none";
    leaderboardBtn.style.display = "inline-block";
    achievementsBtn.style.display = "inline-block";
    
     window.explodeAllThenShowStats(() => {
     resultsOverlay.style.display = "flex";
   }, {
      selector: ".tile",
      duration: 600,
      distance: 300,
      popBefore: true
  });
}
 const tiles = document.querySelectorAll('.tile');

  if (tiles.length === 0) {
    // No tiles, just show results overlay
    document.getElementById("results-overlay").style.display = "flex";
    return;
  }
 tiles.forEach(tile => {
    tile.classList.remove("explode", "pop");
    tile.style.setProperty("--tx", "0px");
    tile.style.setProperty("--ty", "0px");
    tile.style.setProperty("--rot", "0deg");
  });
void document.body.offsetWidth;

 tiles.forEach(tile => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 300 * (0.6 + Math.random() * 0.4);
    const tx = Math.round(Math.cos(angle) * dist);
    const ty = Math.round(Math.sin(angle) * dist);
    const rot = Math.round((Math.random() - 0.5) * 360);

    tile.style.setProperty("--tx", `${tx}px`);
    tile.style.setProperty("--ty", `${ty}px`);
    tile.style.setProperty("--rot", `${rot}deg`);
  });
 setTimeout(() => {
    tiles.forEach(tile => {
      tile.classList.add("explode");
    });
  }, 50);

 setTimeout(() => {
    tiles.forEach(tile => {
      tile.style.visibility = "hidden";
    });

 document.getElementById("results-overlay").style.display = "flex";

 if (window.explodeAllThenShowStats) {
      window.explodeAllThenShowStats(() => {
        document.getElementById("results-overlay").style.display = "flex";
      }, {
        selector: ".tile",
        duration: 600,
        distance: 300,
        popBefore: true
      });
    }
  }, 700);
}

function submitRunToGlobalLeaderboard(score, level, pct) {
    // Placeholder for leaderboard submission
    // In a real app, this would send data to a server
    console.log("Submitting run:", { score, level, accuracy: pct });
}

function switchLbTab(tab) {
    const myPanel = document.getElementById("lb-panel-my");
    const globalPanel = document.getElementById("lb-panel-global");
    const myTab = document.getElementById("lb-tab-my");
    const globalTab = document.getElementById("lb-tab-global");
    
    if (tab === "my") {
        myPanel.classList.add("active");
        globalPanel.classList.remove("active");
        myTab.classList.add("active");
        globalTab.classList.remove("active");
    } else {
        myPanel.classList.remove("active");
        globalPanel.classList.add("active");
        myTab.classList.remove("active");
        globalTab.classList.add("active");
    }
}

function renderLeaderboard() {
    const w = currentProfile.weekly;
    if (!w || !w.runs) return;
    
    lbBest.textContent = `Best score this week: ${w.bestScore}`;
    lbReset.textContent = `Resets Monday`;
    lbUsername.textContent = `Playing as: ${currentProfile.username}`;
    
    lbRuns.innerHTML = "";
    w.runs.slice().reverse().forEach((run, idx) => {
        const row = document.createElement("div");
        row.className = "lb-run-row";
        row.innerHTML = `
            <div class="lb-run-label">
                <span>#${idx + 1}</span>
                <span>${run.score} pts</span>
            </div>
            <div style="font-size: 11px; color: var(--text-soft);">
                Level ${run.level} • ${run.accuracy}% acc
            </div>
        `;
        lbRuns.appendChild(row);
    });
}

function renderAchievements() {
    achListEl.innerHTML = "";
    
    if (!currentProfile.achievements || currentProfile.achievements.length === 0) {
        achListEl.innerHTML = '<p style="color: var(--text-soft);">No achievements yet. Play to earn medals!</p>';
        return;
    }
    
    currentProfile.achievements.slice().reverse().forEach(ach => {
        const card = document.createElement("div");
        card.className = `medal-card medal-${ach.medal}`;
        const date = new Date(ach.weekStart);
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        
        const medalEmoji = {
            gold: "🥇",
            silver: "🥈",
            bronze: "🥉"
        }[ach.medal] || "🏅";
        
        card.innerHTML = `
            <div class="medal-title">
                <span>${medalEmoji}</span>
                <span>${ach.medal.toUpperCase()} MEDAL</span>
            </div>
            <div class="medal-date">Week of ${dateStr}</div>
        `;
        achListEl.appendChild(card);
    });
}

// Event listeners
pauseBtn.onclick = () => {
    paused = true;
    pauseOverlay.style.display = "flex";
};

continueBtn.onclick = () => {
    paused = false;
    pauseOverlay.style.display = "none";
};

restartBtn.onclick = () => {
    startSession();
};

playAgainBtn.onclick = () => {
    startSession();
};

leaderboardBtn.onclick = () => {
    renderLeaderboard();
    leaderboardOverlay.style.display = "flex";
};

lbCloseBtn.onclick = () => {
    leaderboardOverlay.style.display = "none";
};

lbNameBtn.onclick = () => {
    nameInput.value = currentProfile.username;
    nameOverlay.style.display = "flex";
};

nameSaveBtn.onclick = () => {
    const newName = nameInput.value.trim();
    if (newName) {
        currentProfile.username = newName;
        saveProfiles();
        nameOverlay.style.display = "none";
        renderLeaderboard();
    }
};

lbProfileBtn.onclick = () => {
    showProfileOverlay();
};

profileCloseBtn.onclick = () => {
    hideProfileOverlay();
};

addProfileBtn.onclick = () => {
    if (Object.keys(profilesData.profiles).length < 3) {
        const newProfile = createNewProfile();
        profilesData.profiles[newProfile.id] = newProfile;
        saveProfiles();
        renderProfileList();
    }
};

achievementsBtn.onclick = () => {
    renderAchievements();
    achievementsOverlay.style.display = "flex";
};

achCloseBtn.onclick = () => {
    achievementsOverlay.style.display = "none";
};

// Initialize the game
loadProfiles();
startBtn.onclick = () => {
    startSession();
};

