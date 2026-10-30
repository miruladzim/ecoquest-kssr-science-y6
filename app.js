// ============================================================================
// ECOQUEST GAME ENGINE, AUDIO SYNTHESIZER & TEACHER ANALYTICS CONTROLLER
// ============================================================================

const gameState = {
  studentName: "Aiman Hakimi (6 Inovatif)",
  avatar: "🐯",
  avatarTitle: "Malayan Tiger",
  mood: "Ready & Curious",
  soundEnabled: true,
  calmMode: true,
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
  activeShield: false,
  powerups: {
    fiftyFifty: 2,
    doubleXp: 2,
    shield: 2
  },
  history: [], // { qId, code, title, initialCorrect, redeemed, chosenOption, misconceptionTag }
  selectedAnalyticsQId: 3, // Default to Q3 (47% accuracy - highest misconception)
  hideStudentNames: true
};

// Web Audio API Synthesizer for Zero-Dependency Multimedia Sound Effects
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

  playTone(freq, type = "sine", duration = 0.18, delay = 0, gainVal = 0.14) {
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
    } catch (e) {
      // Ignore audio context restrictions
    }
  }

  playCorrect() {
    this.playTone(523.25, "triangle", 0.15, 0, 0.16);   // C5
    this.playTone(659.25, "triangle", 0.15, 0.1, 0.16); // E5
    this.playTone(783.99, "triangle", 0.25, 0.2, 0.18); // G5
    this.playTone(1046.5, "sine", 0.35, 0.3, 0.15);     // C6
  }

  playGentleCoaching() {
    // Warm, non-punishing two-note chime for diagnostic feedback
    this.playTone(392.0, "sine", 0.22, 0, 0.14);   // G4
    this.playTone(349.23, "sine", 0.32, 0.18, 0.14); // F4
  }

  playPowerup() {
    this.playTone(440, "sine", 0.12, 0, 0.14);
    this.playTone(587.33, "sine", 0.12, 0.08, 0.14);
    this.playTone(880, "triangle", 0.25, 0.16, 0.16);
  }

  playVictory() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, idx) => {
      this.playTone(f, "triangle", 0.22, idx * 0.12, 0.16);
    });
  }
}

const soundFX = new SoundEngine();

// Navigation & View Switching
function switchMainView(viewId, tabElement) {
  document.querySelectorAll(".view-section").forEach((el) => el.classList.remove("active"));
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  if (tabElement) {
    document.querySelectorAll(".mode-tab").forEach((btn) => btn.classList.remove("active"));
    tabElement.classList.add("active");
  }

  if (viewId === "teacher-dashboard-view") {
    renderTeacherDashboard();
  }
}

// Avatar & Mood Selection on Welcome Lobby
function selectAvatar(emoji, title, btnEl) {
  gameState.avatar = emoji;
  gameState.avatarTitle = title;
  document.querySelectorAll(".avatar-btn").forEach((b) => b.classList.remove("selected"));
  btnEl.classList.add("selected");
  soundFX.playTone(600, "sine", 0.08);
}

function selectMood(moodText, btnEl) {
  gameState.mood = moodText;
  document.querySelectorAll(".mood-btn").forEach((b) => b.classList.remove("selected"));
  btnEl.classList.add("selected");
  soundFX.playTone(520, "sine", 0.08);
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  const btn = document.getElementById("sound-toggle-btn");
  if (gameState.soundEnabled) {
    btn.classList.add("active-toggle");
    btn.innerHTML = "🔊 Audio & SFX: ON";
    soundFX.playPowerup();
  } else {
    btn.classList.remove("active-toggle");
    btn.innerHTML = "🔇 Audio & SFX: OFF";
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }
}

function toggleCalmMode() {
  gameState.calmMode = !gameState.calmMode;
  const btn = document.getElementById("calm-toggle-btn");
  const paceLabel = document.getElementById("hud-pace-value");
  if (gameState.calmMode) {
    btn.classList.add("active-toggle");
    btn.innerHTML = "🌿 Mindful Self-Pace: ON";
    if (paceLabel) paceLabel.textContent = "Calm Mode (No Timer Stress)";
  } else {
    btn.classList.remove("active-toggle");
    btn.innerHTML = "⏱️ Speed Timer: ON";
    if (paceLabel) paceLabel.textContent = "Challenge Timer Active";
  }
}

// Start or Restart Quest
function startEcoQuest() {
  const inputEl = document.getElementById("student-name-input");
  if (inputEl && inputEl.value.trim()) {
    gameState.studentName = inputEl.value.trim();
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
  gameState.activeShield = false;
  gameState.powerups = { fiftyFifty: 2, doubleXp: 2, shield: 2 };
  gameState.history = [];

  document.getElementById("lobby-screen").style.display = "none";
  document.getElementById("summary-screen").style.display = "none";
  document.getElementById("gameplay-screen").style.display = "block";

  soundFX.playPowerup();
  renderCurrentQuestion();
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
  document.getElementById("hud-player-name").textContent = `${gameState.avatar} ${gameState.studentName}`;
  document.getElementById("hud-xp-value").textContent = `${gameState.xp} XP`;
  document.getElementById("hud-streak-value").textContent = `${gameState.streak} 🔥`;

  const totalQ = QUESTION_BANK.length;
  if (!gameState.isRedemptionPhase) {
    document.getElementById("hud-stage-value").textContent = `Mission ${gameState.currentIndex + 1} / ${totalQ}`;
  } else {
    document.getElementById("hud-stage-value").textContent = `🛡️ Redemption ${gameState.redemptionIndex + 1} / ${gameState.redemptionQueue.length}`;
  }

  const masteredSoFar = gameState.initialCorrectCount + gameState.redeemedCorrectCount;
  const pct = Math.min(100, Math.round((masteredSoFar / totalQ) * 100));
  document.getElementById("eco-meter-pct").textContent = `${pct}% Restored`;
  document.getElementById("eco-meter-fill").style.width = `${pct}%`;

  // Update Powerup buttons
  const btn50 = document.getElementById("pu-fifty");
  const btn2x = document.getElementById("pu-double");
  const btnShield = document.getElementById("pu-shield");

  btn50.innerHTML = `🔍 50/50 Filter (${gameState.powerups.fiftyFifty})`;
  btn50.disabled = gameState.powerups.fiftyFifty <= 0 || gameState.answeredCurrent;

  btn2x.innerHTML = `⚡ 2x Bio-Boost (${gameState.powerups.doubleXp})`;
  btn2x.disabled = gameState.powerups.doubleXp <= 0 || gameState.answeredCurrent || gameState.activeDoubleXp;

  btnShield.innerHTML = `🛡️ Streak Shield (${gameState.powerups.shield})`;
  btnShield.disabled = gameState.powerups.shield <= 0 || gameState.answeredCurrent || gameState.activeShield;
}

function renderCurrentQuestion() {
  const q = getActiveQuestion();
  if (!q) return;

  gameState.answeredCurrent = false;
  gameState.activeDoubleXp = false;
  gameState.activeShield = false;

  updateHUD();

  const phaseBanner = document.getElementById("redemption-banner");
  if (gameState.isRedemptionPhase) {
    phaseBanner.style.display = "block";
    phaseBanner.innerHTML = `🛡️ <strong>REDEMPTION LAB ROUND:</strong> Apply the diagnostic clue you learned earlier to master this concept and earn full recovery credit!`;
  } else {
    phaseBanner.style.display = "none";
  }

  document.getElementById("q-category-badge").textContent = q.category;
  document.getElementById("q-bloom-badge").textContent = `Bloom's: ${q.bloomLevel}`;
  document.getElementById("q-title").textContent = `${q.id}. ${q.title}`;
  document.getElementById("q-scenario").textContent = q.scenario;
  document.getElementById("q-svg-container").innerHTML = q.svgDiagram;
  document.getElementById("q-prompt").textContent = q.question;

  // Reset Clue Box
  const clueBox = document.getElementById("q-clue-box");
  clueBox.textContent = `💡 Ecological Field Clue: ${q.clue}`;
  clueBox.classList.remove("visible");

  // Render Options
  const optionsContainer = document.getElementById("q-options-list");
  optionsContainer.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.id = `opt-btn-${opt.id}`;
    btn.onclick = () => handleOptionSelect(opt.id);
    btn.innerHTML = `
      <span class="option-letter">${opt.id}</span>
      <span>${opt.text}</span>
    `;
    optionsContainer.appendChild(btn);
  });

  // Hide Feedback Drawer
  const drawer = document.getElementById("feedback-drawer");
  drawer.className = "feedback-drawer";
  drawer.innerHTML = "";
}

function toggleFieldClue() {
  const clueBox = document.getElementById("q-clue-box");
  clueBox.classList.toggle("visible");
  soundFX.playTone(540, "sine", 0.1);
}

function narrateCurrentQuestion() {
  const q = getActiveQuestion();
  if (!q) return;
  soundFX.playTone(660, "sine", 0.12);

  const statusEl = document.getElementById("audio-status-label");
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(q.audioScript);
    utter.rate = 0.98;
    utter.pitch = 1.02;
    utter.onstart = () => {
      if (statusEl) statusEl.textContent = "🔊 Playing Field Audio Narration...";
    };
    utter.onend = () => {
      if (statusEl) statusEl.textContent = "🔊 Listen to Field Guide Audio";
    };
    window.speechSynthesis.speak(utter);
  } else {
    if (statusEl) statusEl.textContent = "🔊 Audio Synth Chime Played";
  }
}

// Power-Up Handlers
function useFiftyFifty() {
  if (gameState.powerups.fiftyFifty <= 0 || gameState.answeredCurrent) return;
  const q = getActiveQuestion();
  const wrongOpts = q.options.filter((o) => !o.isCorrect);
  // Shuffle and pick 2 wrong options to eliminate
  const toEliminate = wrongOpts.slice(0, 2);
  toEliminate.forEach((opt) => {
    const btn = document.getElementById(`opt-btn-${opt.id}`);
    if (btn) btn.classList.add("eliminated");
  });

  gameState.powerups.fiftyFifty--;
  soundFX.playPowerup();
  updateHUD();
}

function useDoubleXp() {
  if (gameState.powerups.doubleXp <= 0 || gameState.answeredCurrent || gameState.activeDoubleXp) return;
  gameState.activeDoubleXp = true;
  gameState.powerups.doubleXp--;
  soundFX.playPowerup();
  updateHUD();
}

function useStreakShield() {
  if (gameState.powerups.shield <= 0 || gameState.answeredCurrent || gameState.activeShield) return;
  gameState.activeShield = true;
  gameState.powerups.shield--;
  soundFX.playPowerup();
  updateHUD();
}

// Handle Student Selecting an Answer Option
function handleOptionSelect(optionId) {
  if (gameState.answeredCurrent) return;
  gameState.answeredCurrent = true;

  const q = getActiveQuestion();
  const chosenOpt = q.options.find((o) => o.id === optionId);
  const correctOpt = q.options.find((o) => o.isCorrect);

  // Highlight buttons
  q.options.forEach((opt) => {
    const btn = document.getElementById(`opt-btn-${opt.id}`);
    if (!btn) return;
    btn.disabled = true;
    if (opt.isCorrect) {
      btn.classList.add("correct-choice");
    } else if (opt.id === optionId && !opt.isCorrect) {
      btn.classList.add("wrong-choice");
    }
  });

  const drawer = document.getElementById("feedback-drawer");
  let earnedXp = 0;

  if (chosenOpt.isCorrect) {
    soundFX.playCorrect();
    gameState.streak++;
    if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;

    const basePoints = q.id === 10 ? 250 : 100;
    const streakBonus = gameState.streak * 15;
    earnedXp = (basePoints + streakBonus) * (gameState.activeDoubleXp ? 2 : 1);
    gameState.xp += earnedXp;

    if (!gameState.isRedemptionPhase) {
      gameState.initialCorrectCount++;
      gameState.history.push({
        qId: q.id,
        code: q.code,
        title: q.title,
        initialCorrect: true,
        redeemed: false,
        chosenOption: chosenOpt.id,
        misconceptionTag: "None (Mastered on First Attempt)"
      });
    } else {
      gameState.redeemedCorrectCount++;
      const histItem = gameState.history.find((h) => h.qId === q.id);
      if (histItem) histItem.redeemed = true;
    }

    drawer.className = "feedback-drawer visible correct";
    drawer.innerHTML = `
      <div class="feedback-header">
        <span>✅ SCIENTIFIC MASTERY! (${gameState.isRedemptionPhase ? "Redeemed!" : "First-Try Accuracy"})</span>
        <span style="color:#fde047;">+${earnedXp} XP ${gameState.activeDoubleXp ? "(2x Bio-Boost!)" : ""}</span>
      </div>
      <div class="feedback-body">${chosenOpt.feedback}</div>
      <button class="next-q-btn" onclick="advanceToNextStage()">Continue Mission →</button>
    `;
  } else {
    soundFX.playGentleCoaching();
    if (gameState.activeShield) {
      // Streak preserved by shield
    } else {
      gameState.streak = 0;
    }
    earnedXp = 25; // Effort & reflection XP so student never feels demoralized
    gameState.xp += earnedXp;

    if (!gameState.isRedemptionPhase) {
      if (!gameState.redemptionQueue.includes(q.id)) {
        gameState.redemptionQueue.push(q.id);
      }
      gameState.history.push({
        qId: q.id,
        code: q.code,
        title: q.title,
        initialCorrect: false,
        redeemed: false,
        chosenOption: chosenOpt.id,
        misconceptionTag: chosenOpt.misconceptionTag || "Conceptual Confusion"
      });
    }

    drawer.className = "feedback-drawer visible incorrect";
    drawer.innerHTML = `
      <div class="feedback-header">
        <span>💡 DIAGNOSTIC FIELD COACHING ${gameState.activeShield ? "(🛡️ Streak Protected!)" : ""}</span>
        <span style="color:#fde68a;">+${earnedXp} Effort XP</span>
      </div>
      <div class="misconception-pill">🔍 Diagnosed Misconception: ${chosenOpt.misconceptionTag || "Symbiosis Classification"}</div>
      <div class="feedback-body">
        <p style="margin-bottom:6px;">${chosenOpt.feedback}</p>
        <p style="color:#a7f3d0;font-weight:600;">✔ Correct Scientific Concept (${correctOpt.id}): ${correctOpt.text}</p>
        ${!gameState.isRedemptionPhase ? `<p style="margin-top:6px;font-size:0.8rem;color:#bae6fd;">🛡️ <strong>Added to Redemption Queue:</strong> You will get a second chance to master this question at the end of the quest!</p>` : ""}
      </div>
      <button class="next-q-btn" onclick="advanceToNextStage()">Got It! Continue →</button>
    `;
  }

  updateHUD();
}

function advanceToNextStage() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  if (!gameState.isRedemptionPhase) {
    if (gameState.currentIndex + 1 < QUESTION_BANK.length) {
      gameState.currentIndex++;
      renderCurrentQuestion();
    } else if (gameState.redemptionQueue.length > 0) {
      // Launch Redemption Phase!
      gameState.isRedemptionPhase = true;
      gameState.redemptionIndex = 0;
      soundFX.playPowerup();
      renderCurrentQuestion();
    } else {
      finishEcoQuest();
    }
  } else {
    if (gameState.redemptionIndex + 1 < gameState.redemptionQueue.length) {
      gameState.redemptionIndex++;
      renderCurrentQuestion();
    } else {
      finishEcoQuest();
    }
  }
}

function finishEcoQuest() {
  soundFX.playVictory();
  document.getElementById("gameplay-screen").style.display = "none";
  document.getElementById("summary-screen").style.display = "block";

  const totalQ = QUESTION_BANK.length;
  const prePct = Math.round((gameState.initialCorrectCount / totalQ) * 100);
  const finalPct = Math.round(((gameState.initialCorrectCount + gameState.redeemedCorrectCount) / totalQ) * 100);

  document.getElementById("sum-student-header").textContent = `${gameState.avatar} ${gameState.studentName} — Ecosystem Restoration Complete!`;
  document.getElementById("sum-xp").textContent = `${gameState.xp} XP`;
  document.getElementById("sum-pre-acc").textContent = `${prePct}%`;
  document.getElementById("sum-post-acc").textContent = `${finalPct}%`;
  document.getElementById("sum-streak").textContent = `${gameState.maxStreak} 🔥`;

  // Populate Student Diagnostic History Table
  const tbody = document.getElementById("sum-history-tbody");
  tbody.innerHTML = "";
  gameState.history.forEach((item) => {
    const tr = document.createElement("tr");
    let statusBadge = "";
    if (item.initialCorrect) {
      statusBadge = `<span class="status-tag good">✅ First-Try Mastery</span>`;
    } else if (item.redeemed) {
      statusBadge = `<span class="status-tag good">🛡️ Redeemed on 2nd Chance</span>`;
    } else {
      statusBadge = `<span class="status-tag warn">🔄 Needs Teacher Review</span>`;
    }

    tr.innerHTML = `
      <td><strong>Q${item.qId}</strong> (${item.code})</td>
      <td>${item.title}</td>
      <td>${statusBadge}</td>
      <td>${item.misconceptionTag}</td>
    `;
    tbody.appendChild(tr);
  });

  // Also sync current player's attempt into Teacher Roster top row
  const existingPlayer = CLASS_ROSTER_DATA.find((s) => s.id === "LIVE");
  const liveRecord = {
    id: "LIVE",
    name: `${gameState.studentName} (Live Session)`,
    preScore: prePct,
    postRedemption: finalPct,
    anxietyStatus: gameState.calmMode ? "Calm (Mindful Pace)" : "Active",
    flaggedQ: gameState.history.filter((h) => !h.initialCorrect).map((h) => h.code),
    misconception: gameState.history.find((h) => !h.initialCorrect)?.misconceptionTag || "None (Mastered)"
  };
  if (existingPlayer) {
    Object.assign(existingPlayer, liveRecord);
  } else {
    CLASS_ROSTER_DATA.unshift(liveRecord);
  }
}

// ============================================================================
// TEACHER DATA & MISCONCEPTION ANALYTICS DASHBOARD (LESSON PLAN STEP 3)
// ============================================================================
function renderTeacherDashboard() {
  const heatmapContainer = document.getElementById("teacher-heatmap-list");
  if (!heatmapContainer) return;
  heatmapContainer.innerHTML = "";

  QUESTION_BANK.forEach((q) => {
    const acc = q.classStats.accuracy;
    const isLow = acc < 65;
    const barColor = acc < 60 ? "#f43f5e" : acc < 75 ? "#f59e0b" : "#10b981";

    const row = document.createElement("div");
    row.className = `heatmap-row ${isLow ? "alert-row" : ""} ${gameState.selectedAnalyticsQId === q.id ? "selected" : ""}`;
    row.onclick = () => {
      gameState.selectedAnalyticsQId = q.id;
      renderTeacherDashboard();
    };

    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.86rem;">
        <span><strong>Q${q.id}: ${q.title}</strong> ${isLow ? `<span class="status-tag warn">⚠️ Misconception Hotspot</span>` : ""}</span>
        <span style="font-weight:800;color:${barColor};">${acc}% Class Accuracy</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${acc}%;background:${barColor};"></div>
      </div>
    `;
    heatmapContainer.appendChild(row);
  });

  renderSelectedQuestionInspector();
  renderClassRosterTable();
}

function renderSelectedQuestionInspector() {
  const q = QUESTION_BANK.find((item) => item.id === gameState.selectedAnalyticsQId) || QUESTION_BANK[2];
  const container = document.getElementById("teacher-q-inspector");
  if (!container) return;

  const totalStudents = 32;
  let optionsBreakdownHTML = "";

  q.options.forEach((opt) => {
    const count = q.classStats.distractorCounts[opt.id] || 0;
    const pct = Math.round((count / totalStudents) * 100);
    const barColor = opt.isCorrect ? "#10b981" : count >= 6 ? "#f43f5e" : "#64748b";

    optionsBreakdownHTML += `
      <div style="margin-bottom:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(148,163,184,0.16);">
        <div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:4px;">
          <span><strong>Option ${opt.id} ${opt.isCorrect ? "✅ (Correct Answer)" : "❌ (Distractor)"}:</strong> ${opt.text}</span>
          <span style="font-weight:800;color:${barColor};white-space:nowrap;margin-left:8px;">${count}/32 (${pct}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:${barColor};"></div>
        </div>
        ${!opt.isCorrect && opt.misconceptionTag ? `<div style="margin-top:6px;font-size:0.78rem;color:#fda4af;">🔍 <strong>Root Misconception Diagnosed:</strong> ${opt.misconceptionTag}</div>` : ""}
      </div>
    `;
  });

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span class="q-category-badge">${q.code} — ${q.category}</span>
      <span style="font-size:0.8rem;color:#38bdf8;font-weight:700;">🔒 Anonymous Smartboard View Ready</span>
    </div>
    <h4 style="font-size:1.05rem;margin-bottom:6px;">Q${q.id}: ${q.title}</h4>
    <p style="font-size:0.86rem;color:#cbd5e1;margin-bottom:14px;">${q.question}</p>
    ${optionsBreakdownHTML}
    <div style="margin-top:14px;padding:12px;border-radius:10px;background:rgba(16,185,129,0.12);border:1px solid #34d399;font-size:0.84rem;">
      <strong style="color:#6ee7b7;display:block;margin-bottom:4px;">🎯 Teacher Action Protocol (Lesson Step 3 Intervention):</strong>
      1. Project this anonymous breakdown on the classroom smartboard (Student Names Hidden to prevent social anxiety).<br/>
      2. Ask student pairs to hold up their physical <strong>[ + / 0 / - ] Ecological Sign Cards</strong> for both organisms in Q${q.id}.<br/>
      3. Clarify why the host organism experiences <strong>${q.category.includes("0") ? "Neutral [0] effect (outer bark/skin support only)" : "the specific ecological outcome"}</strong> before launching the Redemption Round.
    </div>
  `;
}

function toggleHideStudentNames() {
  gameState.hideStudentNames = !gameState.hideStudentNames;
  const btn = document.getElementById("toggle-anon-btn");
  if (btn) {
    btn.textContent = gameState.hideStudentNames
      ? "👁️ Show Student Names (Teacher Only)"
      : "🔒 Hide Student Names (Smartboard Safe Mode)";
  }
  renderClassRosterTable();
}

function renderClassRosterTable() {
  const tbody = document.getElementById("teacher-roster-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  CLASS_ROSTER_DATA.forEach((student, idx) => {
    const tr = document.createElement("tr");
    const displayName = gameState.hideStudentNames
      ? `Eco-Guardian #${idx + 1} (Anonymous Smartboard ID)`
      : student.name;

    const gain = student.postRedemption - student.preScore;
    tr.innerHTML = `
      <td><strong>${displayName}</strong></td>
      <td>${student.preScore}%</td>
      <td><strong style="color:#34d399;">${student.postRedemption}%</strong> <span style="font-size:0.75rem;color:#a7f3d0;">(+${gain}%)</span></td>
      <td>${student.flaggedQ.length ? student.flaggedQ.join(", ") : "None"}</td>
      <td><span class="status-tag ${student.misconception.includes("None") ? "good" : "warn"}">${student.misconception}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function exportFormativeCSV() {
  let csv = "Student_ID,Student_Name,Pre_Redemption_Score,Post_Redemption_Score,Flagged_Questions,Diagnosed_Misconception\n";
  CLASS_ROSTER_DATA.forEach((s) => {
    csv += `"${s.id}","${s.name}",${s.preScore},${s.postRedemption},"${s.flaggedQ.join("; ")}","${s.misconception}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Year6_Inovatif_EcoQuest_Formative_Analytics.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function renderBlueprintMatrix() {
  const tbody = document.getElementById("blueprint-matrix-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  QUESTION_BANK.forEach((q) => {
    const primaryMisc = q.options.find((o) => !o.isCorrect && o.misconceptionTag)?.misconceptionTag || "Symbiosis Classification";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${q.code}</strong></td>
      <td>${q.title} <em>(${q.category})</em></td>
      <td><span class="q-bloom-badge">${q.bloomLevel}</span></td>
      <td>🖼️ Custom SVG Diagram + 🔊 Web Speech Audio</td>
      <td><span class="status-tag warn">${primaryMisc}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Initialize on DOM load & support URL query params (?demoStage=1..4) for chronological screenshots
window.addEventListener("DOMContentLoaded", () => {
  renderTeacherDashboard();
  renderBlueprintMatrix();

  const params = new URLSearchParams(window.location.search);
  const demoStage = params.get("demoStage");

  if (demoStage === "1") {
    // Stage 1: Curriculum & Question Blueprint Authoring Matrix
    switchMainView("blueprint-view", document.querySelectorAll(".mode-tab")[2]);
  } else if (demoStage === "2") {
    // Stage 2: Student Lobby & Multimedia / Avatar / Anxiety-Safe Setup
    switchMainView("student-play-view", document.querySelectorAll(".mode-tab")[0]);
  } else if (demoStage === "3") {
    // Stage 3: Active Gameplay on High-Misconception Question (Q3 Bird's Nest Fern) with Power-Ups & Diagnostic Feedback Drawer Open
    switchMainView("student-play-view", document.querySelectorAll(".mode-tab")[0]);
    startEcoQuest();
    gameState.currentIndex = 2; // Q3: Bird's Nest Fern on Oil Palm
    gameState.xp = 230;
    gameState.streak = 2;
    renderCurrentQuestion();
    toggleFieldClue();
    handleOptionSelect("A"); // Trigger the diagnostic misconception coaching drawer!
  } else if (demoStage === "4") {
    // Stage 4: Teacher Misconception Analytics Dashboard inspecting Q3 (47% accuracy)
    gameState.selectedAnalyticsQId = 3;
    switchMainView("teacher-dashboard-view", document.querySelectorAll(".mode-tab")[1]);
  }
});
