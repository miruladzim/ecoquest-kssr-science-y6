// ============================================================================
// ECOQUEST 3D GAME CONTROLLER, CONFETTI ENGINE & TEACHER DASHBOARD
// ============================================================================

const gameState = {
  studentName: "Aiman",
  avatar: "🐯",
  soundEnabled: true,
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
  },
  history: [],
  selectedAnalyticsQId: 3,
  hideStudentNames: true
};

let eco3d = null;

// Sound Synthesizer (Web Audio API)
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

// 2D Celebration Confetti Shower Overlay
function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#4ade80", "#fde047", "#38bdf8", "#f472b6", "#fb923c", "#c084fc"];
  const pieces = Array.from({ length: 75 }, () => ({
    x: canvas.width * 0.5 + (Math.random() - 0.5) * 300,
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
      p.vy += 0.42; // gravity
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

// Character Selection on Welcome Screen
function pickCharacter(emoji, cardEl) {
  gameState.avatar = emoji;
  document.querySelectorAll(".char-card-3d").forEach((c) => c.classList.remove("selected"));
  cardEl.classList.add("selected");
  soundFX.playTone(620, "sine", 0.08);
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  const btn = document.getElementById("sound-btn");
  if (btn) {
    btn.innerHTML = gameState.soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
  }
  if (!gameState.soundEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  } else {
    soundFX.playPowerup();
  }
}

function showView(viewName) {
  document.getElementById("student-game-section").style.display = viewName === "game" ? "block" : "none";
  document.getElementById("teacher-view-section").style.display = viewName === "teacher" ? "block" : "none";

  const teacherBtn = document.getElementById("teacher-mode-btn");
  if (teacherBtn) {
    if (viewName === "teacher") {
      teacherBtn.innerHTML = "🎮 Back to 3D Game";
      teacherBtn.onclick = () => showView("game");
      renderTeacherDashboard();
    } else {
      teacherBtn.innerHTML = "👩‍🏫 Lecturer / Teacher View";
      teacherBtn.onclick = () => showView("teacher");
      if (eco3d) setTimeout(() => eco3d.handleResize(), 60);
    }
  }
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
  gameState.history = [];

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
  document.getElementById("hud-streak").textContent = `🔥 ${gameState.streak}`;

  const totalQ = QUESTION_BANK.length;
  if (!gameState.isRedemptionPhase) {
    document.getElementById("hud-level-txt").textContent = `Level ${gameState.currentIndex + 1} of ${totalQ}`;
  } else {
    document.getElementById("hud-level-txt").textContent = `🛡️ Bonus Retry ${gameState.redemptionIndex + 1} of ${gameState.redemptionQueue.length}`;
  }

  const mastered = gameState.initialCorrectCount + gameState.redeemedCorrectCount;
  const pct = Math.min(100, Math.round((mastered / totalQ) * 100));
  document.getElementById("hud-progress-pct").textContent = `${pct}%`;
  document.getElementById("hud-progress-fill").style.width = `${pct}%`;

  // Update Power-Up buttons
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

  // Load the matching 3D WebGL Scene!
  if (eco3d) {
    eco3d.loadLevelScene(q.id);
    setTimeout(() => eco3d.handleResize(), 30);
  }

  // Update 3D Top & Bottom Overlays
  document.getElementById("diorama-topic-pill").textContent = gameState.isRedemptionPhase
    ? `🛡️ BONUS RETRY: ${q.category}`
    : `🌿 Level ${q.id}: ${q.category}`;

  document.getElementById("diorama-interact-hint").textContent = "🔄 Drag to Spin 3D World • Click Animals to Bounce!";

  // Render 3D Floating Species Tags
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

  // Update Prof. Rimba Mascot Speech & Question
  document.getElementById("mascot-speech").innerHTML = `<strong>Prof. Rimba 🐯:</strong> "${q.scenario}"`;
  document.getElementById("question-title").textContent = q.question;

  // Render 4 Big 3D Arcade Answer Buttons
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

  // Hide Feedback Popup
  const fb = document.getElementById("feedback-popup");
  fb.className = "feedback-popup-3d";
  fb.innerHTML = "";
}

// Power-Ups
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
      gameState.history.push({ qId: q.id, title: q.title, initialCorrect: true, redeemed: false });
    } else {
      gameState.redeemedCorrectCount++;
      const h = gameState.history.find((item) => item.qId === q.id);
      if (h) h.redeemed = true;
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
      gameState.history.push({ qId: q.id, title: q.title, initialCorrect: false, redeemed: false });
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

// ============================================================================
// VISUAL LECTURER / TEACHER DASHBOARD
// ============================================================================
function renderTeacherDashboard() {
  const listEl = document.getElementById("teacher-q-list");
  if (!listEl) return;
  listEl.innerHTML = "";

  QUESTION_BANK.forEach((q) => {
    const acc = q.classStats.accuracy;
    const isHotspot = acc < 65;
    const color = acc < 60 ? "#f43f5e" : acc < 75 ? "#fbbf24" : "#34d399";

    const div = document.createElement("div");
    div.className = `q-bar-item ${gameState.selectedAnalyticsQId === q.id ? "active-q" : ""}`;
    div.onclick = () => {
      gameState.selectedAnalyticsQId = q.id;
      renderTeacherDashboard();
    };
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:0.92rem;margin-bottom:6px;">
        <span>Q${q.id}: ${q.title} ${isHotspot ? "⚠️" : "✅"}</span>
        <span style="color:${color};">${acc}% Correct</span>
      </div>
      <div style="height:10px;background:rgba(0,0,0,0.4);border-radius:999px;overflow:hidden;">
        <div style="height:100%;width:${acc}%;background:${color};border-radius:999px;"></div>
      </div>
    `;
    listEl.appendChild(div);
  });

  // Render Right Inspector
  const q = QUESTION_BANK.find((item) => item.id === gameState.selectedAnalyticsQId) || QUESTION_BANK[2];
  const detailEl = document.getElementById("teacher-q-detail");
  if (detailEl) {
    let bars = "";
    q.options.forEach((opt) => {
      const cnt = q.classStats.distractorCounts[opt.id] || 0;
      const pct = Math.round((cnt / 32) * 100);
      const col = opt.isCorrect ? "#34d399" : cnt >= 6 ? "#f43f5e" : "#94a3b8";
      bars += `
        <div style="margin-bottom:12px;padding:12px;border-radius:12px;background:rgba(0,0,0,0.28);">
          <div style="display:flex;justify-content:space-between;font-weight:800;font-size:0.9rem;margin-bottom:4px;">
            <span>Option ${opt.id} ${opt.isCorrect ? "✅ (Correct)" : "❌"}: ${opt.text}</span>
            <span style="color:${col};">${cnt}/32 (${pct}%)</span>
          </div>
          <div style="height:9px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:${col};"></div>
          </div>
          ${!opt.isCorrect && opt.misconceptionTag ? `<div style="margin-top:6px;font-size:0.82rem;color:#fda4af;font-weight:700;">🔍 Misconception Spotted: ${opt.misconceptionTag}</div>` : ""}
        </div>
      `;
    });

    detailEl.innerHTML = `
      <h3 style="font-size:1.15rem;margin-bottom:6px;color:#7dd3fc;">Inspecting Q${q.id}: ${q.title}</h3>
      <p style="font-size:0.95rem;margin-bottom:14px;color:#e2e8f0;">${q.question}</p>
      ${bars}
      <div style="padding:14px;border-radius:14px;background:rgba(16,185,129,0.15);border:2px solid #34d399;font-size:0.9rem;">
        <strong style="color:#6ee7b7;">👩‍🏫 How Teacher Fixes This in Class (Lesson Plan Step 3):</strong><br/>
        Project this anonymous chart on the board, show the 3D model, and ask pairs to hold up their <strong>[+ / 0 / -]</strong> cards before they play the Bonus Retry Round!
      </div>
    `;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Initialize background 3D scene immediately if canvas is present
  renderTeacherDashboard();
});
