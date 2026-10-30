// ============================================================================
// ECOQUEST 3D GAME CONTROLLER, CONFETTI ENGINE & SOUND SYNTHESIZER
// Pure 3D Student Game Prototype (KSSR Year 6 Science)
// ============================================================================

const gameState = {
  studentName: "Aiman",
  avatar: "🐯",
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

// Sound & Music Synthesizer (Web Audio API)
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
  playTone(freq, type = "sine", duration = 0.16, delay = 0, gainVal = 0.14) {
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
    this.playTone(523.25, "triangle", 0.14, 0, 0.18);
    this.playTone(659.25, "triangle", 0.14, 0.09, 0.18);
    this.playTone(783.99, "triangle", 0.18, 0.18, 0.18);
    this.playTone(1046.5, "sine", 0.35, 0.27, 0.2);
  }
  playGentleCoaching() {
    this.playTone(392.0, "sine", 0.2, 0, 0.14);
    this.playTone(349.23, "sine", 0.28, 0.15, 0.14);
  }
  playPowerup() {
    this.playTone(440, "sine", 0.1, 0, 0.15);
    this.playTone(659.25, "sine", 0.12, 0.08, 0.15);
    this.playTone(880, "triangle", 0.22, 0.16, 0.17);
  }
  playVictory() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, idx) => {
      this.playTone(f, "triangle", 0.2, idx * 0.11, 0.18);
    });
  }
}

const soundFX = new SoundEngine();

function toggleAmbientMusic() {
  gameState.musicEnabled = !gameState.musicEnabled;
  const btn = document.getElementById("music-btn");
  if (btn) {
    btn.innerHTML = gameState.musicEnabled ? "🎵 BGM: ON" : "🎵 BGM: OFF";
  }
  if (gameState.musicEnabled) {
    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    let stepIdx = 0;
    bgmInterval = setInterval(() => {
      if (gameState.musicEnabled && gameState.soundEnabled) {
        soundFX.playTone(notes[stepIdx % notes.length], "sine", 0.35, 0, 0.045);
        stepIdx++;
      }
    }, 550);
  } else if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  const btn = document.getElementById("sound-btn");
  if (btn) {
    btn.innerHTML = gameState.soundEnabled ? "🔊 Sound FX: ON" : "🔇 Sound FX: OFF";
  }
  if (!gameState.soundEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  } else {
    soundFX.playPowerup();
  }
}

function returnToTitle() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.getElementById("arena-screen").style.display = "none";
  document.getElementById("victory-screen").style.display = "none";
  document.getElementById("welcome-screen").style.display = "block";
}

// Celebration Confetti Shower Overlay
function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#4ade80", "#fde047", "#38bdf8", "#f472b6", "#fb923c", "#c084fc"];
  const pieces = Array.from({ length: 80 }, () => ({
    x: canvas.width * 0.5 + (Math.random() - 0.5) * 320,
    y: canvas.height * 0.45,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 4,
    size: 8 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
    vRot: (Math.random() - 0.5) * 0.2
  }));

  let frame = 0;
  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42;
      p.rot += p.vRot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    });
    frame++;
    if (frame < 75) {
      requestAnimationFrame(step);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  step();
}

function pickCharacter(emoji, cardEl) {
  gameState.avatar = emoji;
  document.querySelectorAll(".char-card-3d").forEach((c) => c.classList.remove("selected"));
  cardEl.classList.add("selected");
  soundFX.playTone(620, "sine", 0.08);
}

// Launch 3D Game
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
  document.getElementById("hud-player").textContent = `${gameState.avatar} ${gameState.studentName}`;
  document.getElementById("hud-xp").textContent = `⭐ ${gameState.xp} pts`;
  document.getElementById("hud-streak").textContent = `🔥 ${gameState.streak} Streak`;

  const totalQ = QUESTION_BANK.length;
  if (!gameState.isRedemptionPhase) {
    document.getElementById("hud-level-txt").textContent = `Level ${gameState.currentIndex + 1} / ${totalQ}`;
  } else {
    document.getElementById("hud-level-txt").textContent = `🛡️ Bonus Retry ${gameState.redemptionIndex + 1} / ${gameState.redemptionQueue.length}`;
  }

  const mastered = gameState.initialCorrectCount + gameState.redeemedCorrectCount;
  const pct = Math.min(100, Math.round((mastered / totalQ) * 100));
  document.getElementById("hud-progress-pct").textContent = `${pct}%`;
  document.getElementById("hud-progress-fill").style.width = `${pct}%`;

  const btn50 = document.getElementById("pu-5050");
  const btn2x = document.getElementById("pu-2x");
  const btnHint = document.getElementById("pu-hint");

  btn50.innerHTML = `✂️ 50/50 (${gameState.powerups.fiftyFifty})`;
  btn50.disabled = gameState.powerups.fiftyFifty <= 0 || gameState.answeredCurrent;

  btn2x.innerHTML = `⚡ 2x Points (${gameState.powerups.doubleXp})`;
  btn2x.disabled = gameState.powerups.doubleXp <= 0 || gameState.answeredCurrent || gameState.activeDoubleXp;

  btnHint.innerHTML = `💡 Tiger Hint (${gameState.powerups.hint})`;
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
    ? `🛡️ BONUS RETRY: ${q.category}`
    : `🌿 Level ${q.id}: ${q.category}`;

  document.getElementById("diorama-interact-hint").textContent = "🔄 Drag to Spin 3D World • Click Animals to Bounce!";

  const tagsRow = document.getElementById("tags-3d-container");
  tagsRow.innerHTML = "";
  (q.tags3D || []).forEach((t) => {
    const div = document.createElement("div");
    div.className = "tag-3d-chip";
    div.style.borderColor = t.color;
    div.innerHTML = `
      <span class="tag-3d-icon">${t.icon}</span>
      <div>
        <div class="tag-3d-name">${t.name}</div>
        <div class="tag-3d-effect" style="color:${t.color};">${t.effect}</div>
      </div>
    `;
    tagsRow.appendChild(div);
  });

  document.getElementById("mascot-speech").innerHTML = `<strong>Prof. Rimba 🐯:</strong> "${q.scenario}"`;
  document.getElementById("question-title").textContent = q.question;

  const answersGrid = document.getElementById("answers-container");
  answersGrid.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = `answer-tile-3d tile-${opt.id}`;
    btn.id = `ans-tile-${opt.id}`;
    btn.onclick = () => selectAnswer(opt.id);
    btn.innerHTML = `
      <span class="tile-badge">${opt.id}</span>
      <span>${opt.text}</span>
    `;
    answersGrid.appendChild(btn);
  });

  const fb = document.getElementById("feedback-popup");
  fb.className = "feedback-popup-3d";
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
  document.getElementById("mascot-speech").innerHTML = `<strong>Prof. Rimba 🐯:</strong> "✂️ I removed 2 wrong answers for you! Pick from the remaining 2!"`;
  updateHUD();
}

function useDoublePoints() {
  if (gameState.powerups.doubleXp <= 0 || gameState.answeredCurrent || gameState.activeDoubleXp) return;
  gameState.activeDoubleXp = true;
  gameState.powerups.doubleXp--;
  soundFX.playPowerup();
  document.getElementById("mascot-speech").innerHTML = `<strong>Prof. Rimba 🐯:</strong> "⚡ 2x DOUBLE POINTS activated for this question!"`;
  updateHUD();
}

function useTigerHint() {
  if (gameState.powerups.hint <= 0 || gameState.answeredCurrent) return;
  const q = getActiveQuestion();
  gameState.powerups.hint--;
  soundFX.playPowerup();
  document.getElementById("mascot-speech").innerHTML = `<strong>💡 Tiger Hint 🐯:</strong> <span style="color:#fef08a;">"${q.clue}"</span>`;
  if (eco3d) eco3d.triggerCelebration();
  updateHUD();
}

function speakCurrentQuestion() {
  const q = getActiveQuestion();
  if (!q) return;
  soundFX.playTone(640, "sine", 0.1);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(q.audioScript);
    utter.rate = 0.98;
    utter.pitch = 1.05;
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
      btn.classList.add("correct-glow");
    } else if (opt.id === optId && !opt.isCorrect) {
      btn.classList.add("wrong-dim");
    }
  });

  const fb = document.getElementById("feedback-popup");

  if (chosen.isCorrect) {
    soundFX.playCorrect();
    fireConfetti();
    if (eco3d) eco3d.triggerCelebration();

    gameState.streak++;
    if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;

    const pts = ((q.id === 10 ? 250 : 100) + gameState.streak * 20) * (gameState.activeDoubleXp ? 2 : 1);
    gameState.xp += pts;

    if (!gameState.isRedemptionPhase) {
      gameState.initialCorrectCount++;
    } else {
      gameState.redeemedCorrectCount++;
    }

    fb.className = "feedback-popup-3d show good";
    fb.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:1.1rem;font-weight:900;color:#6ee7b7;">🎉 AWESOME! YOU GOT IT!</span>
        <span style="font-size:1.05rem;font-weight:900;color:#fde047;">+${pts} pts!</span>
      </div>
      <p style="font-size:0.95rem;color:#ffffff;margin-bottom:12px;">${chosen.feedback}</p>
      <button class="btn-3d btn-3d-green" style="width:100%;font-size:1.05rem;" onclick="nextStage()">
        Next 3D Level ▶
      </button>
    `;
  } else {
    soundFX.playGentleCoaching();
    gameState.streak = 0;
    gameState.xp += 25;

    if (!gameState.isRedemptionPhase) {
      if (!gameState.redemptionQueue.includes(q.id)) {
        gameState.redemptionQueue.push(q.id);
      }
    }

    fb.className = "feedback-popup-3d show retry";
    fb.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:1.05rem;font-weight:900;color:#fde047;">🐯 ALMOST! LET'S LEARN WHY:</span>
        <span style="font-size:0.9rem;font-weight:800;color:#bae6fd;">🛡️ Saved for Bonus Retry!</span>
      </div>
      <p style="font-size:0.93rem;color:#fef3c7;margin-bottom:6px;">${chosen.feedback}</p>
      <p style="font-size:0.9rem;color:#6ee7b7;font-weight:800;margin-bottom:12px;">✔ Correct Answer (${correct.id}): ${correct.text}</p>
      <button class="btn-3d btn-3d-blue" style="width:100%;font-size:1.05rem;" onclick="nextStage()">
        Got It! Next Level ▶
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
  fireConfetti();
  document.getElementById("arena-screen").style.display = "none";
  document.getElementById("victory-screen").style.display = "block";

  const total = QUESTION_BANK.length;
  const prePct = Math.round((gameState.initialCorrectCount / total) * 100);
  const postPct = Math.round(((gameState.initialCorrectCount + gameState.redeemedCorrectCount) / total) * 100);

  document.getElementById("vic-title").textContent = `🏆 Congratulations, ${gameState.avatar} ${gameState.studentName}!`;
  document.getElementById("vic-xp").textContent = `${gameState.xp} pts`;
  document.getElementById("vic-pre").textContent = `${prePct}%`;
  document.getElementById("vic-post").textContent = `${postPct}%`;
}
