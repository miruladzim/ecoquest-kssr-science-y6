// ============================================================================
// ECOQUEST — INTERACTIVE STEM LAB CONTROLLER (Brilliant.org Style)
// Manages Segmented Progress, Interactive Sim Slider, Audio, and Mastery Retry
// ============================================================================

const gameState = {
  studentName: "Explorer",
  currentIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  firstTryCorrect: 0,
  autoVoice: true,
  isRedemptionMode: false,
  redemptionQueue: [],
  doubleActive: false,
  powerUps: { "5050": 2, double: 2, clue: 2 },
  answeredCurrent: false,
  completedSteps: new Set()
};

let ecoSim = null;
let audioCtx = null;

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  ecoSim = new EcoSimEngine("sim-canvas");
  renderStepSegments();
});

// Synthesized Web Audio UI chimes
function playSound(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "correct") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.start(now);
      osc.stop(now + 0.42);
    } else if (type === "wrong") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.setValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(620, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (_) {}
}

// Render Brilliant.org-style 10-step segmented top bar
function renderStepSegments() {
  const container = document.getElementById("step-segments");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < QUESTION_BANK.length; i++) {
    const dot = document.createElement("div");
    dot.className = "step-dot";
    if (gameState.completedSteps.has(i)) {
      dot.classList.add("done");
    } else if (i === gameState.currentIndex && document.getElementById("screen-quiz")?.style.display !== "none") {
      dot.classList.add("current");
    }
    container.appendChild(dot);
  }
}

function updateTopHUD() {
  const scoreEl = document.getElementById("hud-score");
  const streakEl = document.getElementById("hud-streak");
  if (scoreEl) scoreEl.textContent = `${gameState.score} pts`;
  if (streakEl) {
    streakEl.textContent = gameState.streak >= 2 ? `🔥 ${gameState.streak}` : "";
  }
  renderStepSegments();
}

function resetToHome() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.getElementById("screen-welcome").style.display = "block";
  document.getElementById("screen-quiz").style.display = "none";
  document.getElementById("screen-summary").style.display = "none";
  renderStepSegments();
}

function startExpedition() {
  playSound("click");
  const nameInput = document.getElementById("student-name");
  const rawName = nameInput ? nameInput.value.trim() : "";
  gameState.studentName = rawName || "Explorer";
  gameState.currentIndex = 0;
  gameState.score = 0;
  gameState.streak = 0;
  gameState.bestStreak = 0;
  gameState.firstTryCorrect = 0;
  gameState.isRedemptionMode = false;
  gameState.redemptionQueue = [];
  gameState.doubleActive = false;
  gameState.powerUps = { "5050": 2, double: 2, clue: 2 };
  gameState.completedSteps.clear();

  document.getElementById("screen-welcome").style.display = "none";
  document.getElementById("screen-summary").style.display = "none";
  document.getElementById("screen-quiz").style.display = "block";

  if (ecoSim) ecoSim.resize();
  loadCurrentQuestion();
}

function getActiveQuestion() {
  if (gameState.isRedemptionMode) {
    return gameState.redemptionQueue[0];
  }
  return QUESTION_BANK[gameState.currentIndex];
}

function handleSimSlider(val) {
  const readout = document.getElementById("sim-val-readout");
  if (readout) readout.textContent = `${val}%`;
  if (ecoSim) ecoSim.setSimValue(Number(val), false);
}

function loadCurrentQuestion() {
  const q = getActiveQuestion();
  if (!q) return showSummaryScreen();

  gameState.answeredCurrent = false;
  gameState.doubleActive = false;
  updateTopHUD();

  // Top badge
  const codeBadge = document.getElementById("q-code-badge");
  if (codeBadge) {
    codeBadge.textContent = gameState.isRedemptionMode
      ? `MASTERY RETRY · ${q.code}`
      : q.code;
  }

  // Interactive Slider Metadata
  const ctrlLabel = document.getElementById("sim-control-label");
  const minLabel = document.getElementById("sim-min-label");
  const maxLabel = document.getElementById("sim-max-label");
  const slider = document.getElementById("sim-slider");
  const readout = document.getElementById("sim-val-readout");

  const defaultVal = q.simDefault !== undefined ? q.simDefault : 80;
  if (ctrlLabel) ctrlLabel.textContent = q.simControlLabel || "Interactive Test: Adjust Variable";
  if (minLabel) minLabel.textContent = q.simMinLabel || "0%";
  if (maxLabel) maxLabel.textContent = q.simMaxLabel || "100%";
  if (slider) slider.value = defaultVal;
  if (readout) readout.textContent = `${defaultVal}%`;

  // Build Interactive Canvas Stage
  if (ecoSim) {
    ecoSim.buildStage(q.id, defaultVal);
  }

  // Species Outcome Pills
  const tagsBox = document.getElementById("species-tags");
  if (tagsBox) {
    tagsBox.innerHTML = (q.tags3D || [])
      .map(
        (t) => `
        <div class="species-pill">
          <div class="species-name">${t.name}</div>
          <div class="species-effect" style="color: ${t.color}">${t.effect}</div>
        </div>
      `
      )
      .join("");
  }

  // Scenario & Question Prompt
  document.getElementById("q-scenario").textContent = q.scenario;
  document.getElementById("q-prompt").textContent = q.question;

  // Reset Clue & Feedback
  const clueBox = document.getElementById("clue-box");
  if (clueBox) {
    clueBox.style.display = "none";
    clueBox.textContent = "";
  }
  const fbPanel = document.getElementById("feedback-panel");
  if (fbPanel) {
    fbPanel.className = "feedback-banner";
  }

  // Update Power-Up Buttons
  updatePowerUpButtons();

  // Render Options
  const listEl = document.getElementById("options-list");
  listEl.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "opt-card";
    btn.dataset.optId = opt.id;
    btn.innerHTML = `
      <span class="opt-key">${opt.id}</span>
      <span>${opt.text}</span>
    `;
    btn.onclick = () => selectAnswer(opt, btn);
    listEl.appendChild(btn);
  });

  if (gameState.autoVoice) {
    narrateCurrentQuestion();
  }
}

function selectAnswer(selectedOpt, btnEl) {
  if (gameState.answeredCurrent) return;
  gameState.answeredCurrent = true;

  const q = getActiveQuestion();
  const allBtns = document.querySelectorAll(".opt-card");
  allBtns.forEach((b) => {
    b.disabled = true;
    const oid = b.dataset.optId;
    const match = q.options.find((o) => o.id === oid);
    if (match && match.isCorrect) {
      b.classList.add("is-correct");
    }
  });

  const fbPanel = document.getElementById("feedback-panel");
  const fbTitle = document.getElementById("fb-title");
  const fbPts = document.getElementById("fb-pts");
  const fbText = document.getElementById("fb-text");

  if (selectedOpt.isCorrect) {
    playSound("correct");
    if (ecoSim) ecoSim.triggerFeedbackPulse();

    gameState.streak += 1;
    if (gameState.streak > gameState.bestStreak) {
      gameState.bestStreak = gameState.streak;
    }

    const basePts = q.id === 10 ? 250 : 100;
    const streakBonus = Math.min(gameState.streak * 15, 75);
    const mult = gameState.doubleActive ? 2 : 1;
    const earned = (basePts + streakBonus) * mult;
    gameState.score += earned;

    if (!gameState.isRedemptionMode) {
      gameState.firstTryCorrect += 1;
      gameState.completedSteps.add(gameState.currentIndex);
    } else {
      gameState.redemptionQueue.shift();
    }

    fbPanel.className = "feedback-banner visible correct";
    fbTitle.textContent = "✓ Accurate Scientific Analysis";
    fbTitle.style.color = "#059669";
    fbPts.textContent = `+${earned} pts`;
    fbPts.style.color = "#059669";
    fbText.textContent = selectedOpt.feedback;

    fireConfetti(28);
  } else {
    playSound("wrong");
    btnEl.classList.add("is-wrong");
    gameState.streak = 0;

    if (!gameState.isRedemptionMode) {
      gameState.redemptionQueue.push(q);
    } else {
      // Re-queue at end of redemption list until mastered
      const missed = gameState.redemptionQueue.shift();
      gameState.redemptionQueue.push(missed);
    }

    fbPanel.className = "feedback-banner visible review";
    fbTitle.textContent = "↻ Diagnostic Review (Queued for Mastery Retry)";
    fbTitle.style.color = "#b45309";
    fbPts.textContent = "+0 pts";
    fbPts.style.color = "#b45309";
    fbText.textContent = selectedOpt.feedback;
  }

  updateTopHUD();
}

function nextQuestion() {
  playSound("click");
  if (!gameState.isRedemptionMode) {
    if (gameState.currentIndex < QUESTION_BANK.length - 1) {
      gameState.currentIndex += 1;
      loadCurrentQuestion();
    } else if (gameState.redemptionQueue.length > 0) {
      gameState.isRedemptionMode = true;
      loadCurrentQuestion();
    } else {
      showSummaryScreen();
    }
  } else {
    if (gameState.redemptionQueue.length > 0) {
      loadCurrentQuestion();
    } else {
      showSummaryScreen();
    }
  }
}

function usePowerUp(type) {
  if (gameState.answeredCurrent || gameState.powerUps[type] <= 0) return;
  const q = getActiveQuestion();
  playSound("click");

  if (type === "5050") {
    const wrongBtns = Array.from(document.querySelectorAll(".opt-card")).filter((b) => {
      const m = q.options.find((o) => o.id === b.dataset.optId);
      return m && !m.isCorrect && !b.classList.contains("eliminated");
    });
    wrongBtns.slice(0, 2).forEach((b) => b.classList.add("eliminated"));
    gameState.powerUps["5050"] -= 1;
  } else if (type === "double") {
    if (gameState.doubleActive) return;
    gameState.doubleActive = true;
    gameState.powerUps.double -= 1;
  } else if (type === "clue") {
    const clueBox = document.getElementById("clue-box");
    if (clueBox) {
      clueBox.style.display = "block";
      clueBox.textContent = `💡 Field Clue: ${q.clue}`;
    }
    gameState.powerUps.clue -= 1;
  }
  updatePowerUpButtons();
}

function updatePowerUpButtons() {
  const b50 = document.getElementById("pu-5050");
  const bDb = document.getElementById("pu-double");
  const bCl = document.getElementById("pu-clue");

  if (b50) {
    b50.textContent = `⚡ 50/50 Filter (${gameState.powerUps["5050"]})`;
    b50.disabled = gameState.powerUps["5050"] <= 0;
  }
  if (bDb) {
    bDb.textContent = gameState.doubleActive
      ? "⭐ 2× Active!"
      : `⭐ 2× Points (${gameState.powerUps.double})`;
    bDb.disabled = gameState.powerUps.double <= 0 || gameState.doubleActive;
  }
  if (bCl) {
    bCl.textContent = `💡 Field Clue (${gameState.powerUps.clue})`;
    bCl.disabled = gameState.powerUps.clue <= 0;
  }
}

// Voice Narration (Web Speech API)
function toggleAutoVoice() {
  gameState.autoVoice = !gameState.autoVoice;
  const btn = document.getElementById("btn-voice-toggle");
  if (btn) {
    btn.textContent = gameState.autoVoice ? "🔊 Voice: ON" : "🔇 Voice: OFF";
  }
  if (!gameState.autoVoice && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function narrateCurrentQuestion() {
  if (!("speechSynthesis" in window)) return;
  const q = getActiveQuestion();
  if (!q) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(q.audioScript || q.question);
  utter.rate = 0.98;
  utter.pitch = 1.0;
  window.speechSynthesis.speak(utter);
}

// Summary Screen
function showSummaryScreen() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.getElementById("screen-quiz").style.display = "none";
  document.getElementById("screen-summary").style.display = "block";

  const acc = Math.round((gameState.firstTryCorrect / QUESTION_BANK.length) * 100);
  document.getElementById("sum-score").textContent = gameState.score;
  document.getElementById("sum-accuracy").textContent = `${acc}%`;
  document.getElementById("sum-streak").textContent = gameState.bestStreak;
  document.getElementById("sum-subtitle").textContent =
    `Well done, ${gameState.studentName}! You have verified all 10 KSSR Year 6 Science ecosystem models.`;

  fireConfetti(60);
}

// Minimalist Confetti Burst
function fireConfetti(count = 35) {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#10b981", "#4f46e5", "#38bdf8", "#f59e0b"];
  const pieces = Array.from({ length: count }, () => ({
    x: canvas.width * 0.5 + (Math.random() - 0.5) * 180,
    y: canvas.height * 0.45,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 3,
    size: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1
  }));

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.alpha -= 0.018;
      if (p.alpha > 0) {
        alive = true;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
    if (alive) requestAnimationFrame(step);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  step();
}
