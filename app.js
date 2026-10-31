// ============================================================================
// ECOQUEST 3D — MINIMALIST ASSESSMENT CONTROLLER & AUDIO ENGINE
// ============================================================================

const gameState = {
  studentName: "Aiman Hakimi",
  role: "Marine",
  soundEnabled: true,
  musicEnabled: false,
  currentIndex: 0,
  isRedemptionPhase: false,
  redemptionQueue: [],
  redemptionIndex: 0,
  xp: 0,
  streak: 0,
  maxStreak: 0,
  initialCorrectCount: 0,
  redeemedCorrectCount: 0,
  answeredCurrent: false,
  activeDoubleXp: false,
  powerups: {
    fiftyFifty: 2,
    doubleXp: 2,
    hint: 3
  }
};

let eco3d = null;
let bgmInterval = null;

class SoundEngine {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playTone(freq, type = "sine", duration = 0.14, delay = 0, gainVal = 0.1) {
    if (!gameState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {}
  }
  playCorrect() {
    this.playTone(523.25, "sine", 0.12, 0, 0.12);
    this.playTone(659.25, "sine", 0.14, 0.08, 0.12);
    this.playTone(783.99, "sine", 0.22, 0.16, 0.12);
  }
  playGentleCoaching() {
    this.playTone(392.0, "sine", 0.18, 0, 0.1);
    this.playTone(349.23, "sine", 0.24, 0.14, 0.1);
  }
  playPowerup() {
    this.playTone(587.33, "sine", 0.1, 0, 0.1);
    this.playTone(880, "sine", 0.18, 0.08, 0.1);
  }
  playVictory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      this.playTone(f, "sine", 0.2, idx * 0.1, 0.12);
    });
  }
}

const soundFX = new SoundEngine();

function toggleAmbientMusic() {
  gameState.musicEnabled = !gameState.musicEnabled;
  const btn = document.getElementById("music-btn");
  if (btn) {
    btn.textContent = gameState.musicEnabled ? "Ambient Audio: On" : "Ambient Audio: Off";
    btn.classList.toggle("active", gameState.musicEnabled);
  }
  if (gameState.musicEnabled) {
    const notes = [261.63, 329.63, 392.0, 493.88];
    let stepIdx = 0;
    bgmInterval = setInterval(() => {
      if (gameState.musicEnabled && gameState.soundEnabled) {
        soundFX.playTone(notes[stepIdx % notes.length], "sine", 0.4, 0, 0.03);
        stepIdx++;
      }
    }, 700);
  } else if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  const btn = document.getElementById("sound-btn");
  if (btn) {
    btn.textContent = gameState.soundEnabled ? "Sound Effects: On" : "Sound Effects: Off";
    btn.classList.toggle("active", gameState.soundEnabled);
  }
  if (!gameState.soundEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function returnToTitle() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.getElementById("arena-screen").style.display = "none";
  document.getElementById("victory-screen").style.display = "none";
  document.getElementById("welcome-screen").style.display = "block";
}

function pickRole(roleName, pillEl) {
  gameState.role = roleName;
  document.querySelectorAll(".role-pill").forEach((c) => c.classList.remove("selected"));
  pillEl.classList.add("selected");
  soundFX.playTone(540, "sine", 0.06, 0, 0.08);
}

function startEcoQuest() {
  const nameInput = document.getElementById("player-name-input");
  if (nameInput && nameInput.value.trim()) {
    gameState.studentName = nameInput.value.trim();
  }

  gameState.currentIndex = 0;
  gameState.isRedemptionPhase = false;
  gameState.redemptionQueue = [];
  gameState.redemptionIndex = 0;
  gameState.xp = 0;
  gameState.streak = 0;
  gameState.maxStreak = 0;
  gameState.initialCorrectCount = 0;
  gameState.redeemedCorrectCount = 0;
  gameState.answeredCurrent = false;
  gameState.activeDoubleXp = false;
  gameState.powerups = { fiftyFifty: 2, doubleXp: 2, hint: 3 };

  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("victory-screen").style.display = "none";
  document.getElementById("arena-screen").style.display = "block";

  if (!eco3d) {
    eco3d = new EcoWorld3D("three-canvas");
  } else {
    setTimeout(() => eco3d.handleResize(), 50);
  }

  soundFX.playPowerup();
  renderCurrentLevel();
}

function getActiveQuestion() {
  if (!gameState.isRedemptionPhase) {
    return QUESTION_BANK[gameState.currentIndex];
  } else {
    const qId = gameState.redemptionQueue[gameState.redemptionIndex];
    return QUESTION_BANK.find((q) => q.id === qId);
  }
}

function updateHUD() {
  document.getElementById("hud-player").textContent = gameState.studentName;
  document.getElementById("hud-xp").textContent = `${gameState.xp} PTS`;
  document.getElementById("hud-streak").textContent = `${gameState.streak}`;

  const totalQ = QUESTION_BANK.length;
  if (!gameState.isRedemptionPhase) {
    const num = String(gameState.currentIndex + 1).padStart(2, "0");
    document.getElementById("hud-level-txt").textContent = `${num} / ${totalQ}`;
  } else {
    document.getElementById("hud-level-txt").textContent = `RETRY ${gameState.redemptionIndex + 1} / ${gameState.redemptionQueue.length}`;
  }

  const mastered = gameState.initialCorrectCount + gameState.redeemedCorrectCount;
  const pct = Math.min(100, Math.round((mastered / totalQ) * 100));
  document.getElementById("hud-progress-pct").textContent = `${pct}%`;
  document.getElementById("hud-progress-fill").style.width = `${pct}%`;

  const btn50 = document.getElementById("pu-5050");
  const btn2x = document.getElementById("pu-2x");
  const btnHint = document.getElementById("pu-hint");

  btn50.textContent = `50/50 Filter (${gameState.powerups.fiftyFifty})`;
  btn50.disabled = gameState.powerups.fiftyFifty <= 0 || gameState.answeredCurrent;

  btn2x.textContent = `2× Multiplier (${gameState.powerups.doubleXp})`;
  btn2x.disabled = gameState.powerups.doubleXp <= 0 || gameState.answeredCurrent || gameState.activeDoubleXp;

  btnHint.textContent = `Field Clue (${gameState.powerups.hint})`;
  btnHint.disabled = gameState.powerups.hint <= 0 || gameState.answeredCurrent;
}

function renderCurrentLevel() {
  const q = getActiveQuestion();
  if (!q) return;

  gameState.answeredCurrent = false;
  gameState.activeDoubleXp = false;

  updateHUD();

  if (eco3d) {
    eco3d.loadLevelScene(q.id);
    setTimeout(() => eco3d.handleResize(), 30);
  }

  document.getElementById("diorama-topic-pill").textContent = gameState.isRedemptionPhase
    ? `REDEMPTION REVIEW // ${q.category.toUpperCase()}`
    : q.code;

  document.getElementById("diorama-interact-hint").textContent = "360° Model · Drag to Orbit";

  const tagsRow = document.getElementById("tags-3d-container");
  tagsRow.innerHTML = "";
  (q.tags3D || []).forEach((t) => {
    const div = document.createElement("div");
    div.className = "specimen-chip";
    div.innerHTML = `
      <div class="specimen-name">${t.name}</div>
      <div class="specimen-role" style="color:${t.color};">${t.effect}</div>
    `;
    tagsRow.appendChild(div);
  });

  document.getElementById("mascot-speech").textContent = q.scenario;
  document.getElementById("question-title").textContent = q.question;

  const answersGrid = document.getElementById("answers-container");
  answersGrid.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-item";
    btn.id = `ans-tile-${opt.id}`;
    btn.onclick = () => selectAnswer(opt.id);
    btn.innerHTML = `
      <span class="option-key">${opt.id}</span>
      <span>${opt.text}</span>
    `;
    answersGrid.appendChild(btn);
  });

  const fb = document.getElementById("feedback-popup");
  fb.className = "feedback-card";
  fb.innerHTML = "";
}

function useFiftyFifty() {
  if (gameState.powerups.fiftyFifty <= 0 || gameState.answeredCurrent) return;
  const q = getActiveQuestion();
  const wrongs = q.options.filter((o) => !o.isCorrect).slice(0, 2);
  wrongs.forEach((o) => {
    const btn = document.getElementById(`ans-tile-${o.id}`);
    if (btn) btn.classList.add("eliminated");
  });
  gameState.powerups.fiftyFifty--;
  soundFX.playPowerup();
  updateHUD();
}

function useDoublePoints() {
  if (gameState.powerups.doubleXp <= 0 || gameState.answeredCurrent || gameState.activeDoubleXp) return;
  gameState.activeDoubleXp = true;
  gameState.powerups.doubleXp--;
  soundFX.playPowerup();
  updateHUD();
}

function useTigerHint() {
  if (gameState.powerups.hint <= 0 || gameState.answeredCurrent) return;
  const q = getActiveQuestion();
  gameState.powerups.hint--;
  soundFX.playPowerup();
  document.getElementById("mascot-speech").textContent = `Field Clue: ${q.clue}`;
  updateHUD();
}

function speakCurrentQuestion() {
  const q = getActiveQuestion();
  if (!q) return;
  soundFX.playTone(600, "sine", 0.08);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(q.audioScript);
    utter.rate = 0.98;
    window.speechSynthesis.speak(utter);
  }
}

function selectAnswer(optId) {
  if (gameState.answeredCurrent) return;
  gameState.answeredCurrent = true;

  const q = getActiveQuestion();
  const chosen = q.options.find((o) => o.id === optId);
  const correct = q.options.find((o) => o.isCorrect);

  q.options.forEach((opt) => {
    const btn = document.getElementById(`ans-tile-${opt.id}`);
    if (!btn) return;
    btn.disabled = true;
    if (opt.isCorrect) {
      btn.classList.add("state-correct");
    } else if (opt.id === optId && !opt.isCorrect) {
      btn.classList.add("state-wrong");
    }
  });

  const fb = document.getElementById("feedback-popup");

  if (chosen.isCorrect) {
    soundFX.playCorrect();
    if (eco3d) eco3d.triggerCelebration();

    gameState.streak++;
    if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;

    const pts = ((q.id === 10 ? 250 : 100) + gameState.streak * 15) * (gameState.activeDoubleXp ? 2 : 1);
    gameState.xp += pts;

    if (!gameState.isRedemptionPhase) {
      gameState.initialCorrectCount++;
    } else {
      gameState.redeemedCorrectCount++;
    }

    fb.className = "feedback-card visible correct";
    fb.innerHTML = `
      <div class="feedback-top">
        <span style="color:var(--accent);">Verified · ${q.category}</span>
        <span style="color:var(--text-primary);">+${pts} PTS</span>
      </div>
      <p class="feedback-text">${chosen.feedback}</p>
      <button class="primary-btn" onclick="nextStage()">
        Continue →
      </button>
    `;
  } else {
    soundFX.playGentleCoaching();
    gameState.streak = 0;
    gameState.xp += 20;

    if (!gameState.isRedemptionPhase) {
      if (!gameState.redemptionQueue.includes(q.id)) {
        gameState.redemptionQueue.push(q.id);
      }
    }

    fb.className = "feedback-card visible review";
    fb.innerHTML = `
      <div class="feedback-top">
        <span style="color:var(--amber);">Concept Review</span>
        <span style="color:var(--text-secondary);">Queued for Redemption</span>
      </div>
      <p class="feedback-text" style="margin-bottom:8px;">${chosen.feedback}</p>
      <p class="feedback-text" style="color:var(--text-primary);font-weight:500;">Correct Response (${correct.id}): ${correct.text}</p>
      <button class="primary-btn" onclick="nextStage()">
        Continue →
      </button>
    `;
  }

  updateHUD();
}

function nextStage() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  if (!gameState.isRedemptionPhase) {
    if (gameState.currentIndex + 1 < QUESTION_BANK.length) {
      gameState.currentIndex++;
      renderCurrentLevel();
    } else if (gameState.redemptionQueue.length > 0) {
      gameState.isRedemptionPhase = true;
      gameState.redemptionIndex = 0;
      soundFX.playPowerup();
      renderCurrentLevel();
    } else {
      showVictoryScreen();
    }
  } else {
    if (gameState.redemptionIndex + 1 < gameState.redemptionQueue.length) {
      gameState.redemptionIndex++;
      renderCurrentLevel();
    } else {
      showVictoryScreen();
    }
  }
}

function showVictoryScreen() {
  soundFX.playVictory();
  document.getElementById("arena-screen").style.display = "none";
  document.getElementById("victory-screen").style.display = "block";

  const total = QUESTION_BANK.length;
  const prePct = Math.round((gameState.initialCorrectCount / total) * 100);
  const postPct = Math.round(((gameState.initialCorrectCount + gameState.redeemedCorrectCount) / total) * 100);

  document.getElementById("vic-title").textContent = `${gameState.studentName} — Assessment Complete`;
  document.getElementById("vic-xp").textContent = `${gameState.xp}`;
  document.getElementById("vic-pre").textContent = `${prePct}%`;
  document.getElementById("vic-post").textContent = `${postPct}%`;
}
