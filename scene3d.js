// ============================================================================
// ECOQUEST — INTERACTIVE 2.5D ECOSYSTEM SIMULATION ENGINE (Brilliant.org Style)
// Crisp High-DPI Vector Biological Simulations with Live Slider & Pointer Control
// ============================================================================

class EcoSimEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.currentStage = 1;
    this.simValue = 80; // 0 to 100
    this.targetSimValue = 80;
    this.time = 0;
    this.isDragging = false;
    this.pulseEffect = 0; // Triggered on answer check

    // Ambient particles for water/sunlight/nutrients
    this.particles = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.5 + Math.random() * 2.5,
      speedX: 0.0008 + Math.random() * 0.0018,
      speedY: (Math.random() - 0.5) * 0.001,
      phase: i * 0.7
    }));

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.bindCanvasEvents();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width || 520;
    this.height = rect.height || 320;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bindCanvasEvents() {
    const updateFromPointer = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const pct = Math.round(relX * 100);
      this.setSimValue(pct, true);
    };

    this.canvas.addEventListener("pointerdown", (e) => {
      this.isDragging = true;
      updateFromPointer(e.clientX);
    });

    window.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;
      updateFromPointer(e.clientX);
    });

    window.addEventListener("pointerup", () => {
      this.isDragging = false;
    });
  }

  setSimValue(val, syncSlider = false) {
    this.targetSimValue = Math.max(0, Math.min(100, Number(val)));
    if (syncSlider) {
      const slider = document.getElementById("sim-slider");
      const valLabel = document.getElementById("sim-val-readout");
      if (slider) slider.value = this.targetSimValue;
      if (valLabel) valLabel.textContent = `${this.targetSimValue}%`;
    }
  }

  buildStage(stageId, defaultVal = 80) {
    this.currentStage = stageId;
    this.targetSimValue = defaultVal;
    this.simValue = defaultVal;
    this.resize();
  }

  triggerFeedbackPulse() {
    this.pulseEffect = 1.0;
  }

  // Helper for rounded rectangles
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.closePath();
  }

  // Draw crisp floating HUD badge inside canvas
  drawBadge(x, y, text, bgColor, textColor = "#ffffff") {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = "700 11px 'Plus Jakarta Sans', sans-serif";
    const padX = 10;
    const w = ctx.measureText(text).width + padX * 2;
    const h = 24;
    this.roundRect(ctx, x - w / 2, y - h / 2, w, h, 999);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 0.5);
    ctx.restore();
  }

  // Draw live progress meter bar inside canvas
  drawMeter(x, y, w, label, pct, color) {
    const ctx = this.ctx;
    ctx.save();
    this.roundRect(ctx, x, y, w, 38, 10);
    ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "600 10.5px 'Inter', sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 10, y + 14);

    ctx.font = "700 10.5px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(pct)}%`, x + w - 10, y + 14);

    // Track
    this.roundRect(ctx, x + 10, y + 22, w - 20, 7, 4);
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fill();

    // Fill
    const fillW = Math.max(4, ((w - 20) * Math.max(0, Math.min(100, pct))) / 100);
    this.roundRect(ctx, x + 10, y + 22, fillW, 7, 4);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  // ==========================================================================
  // STAGE 1: CLOWNFISH & SEA ANEMONE (MUTUALISM + / +)
  // ==========================================================================
  drawStage1(w, h, t, s) {
    const ctx = this.ctx;
    // Reef Ocean Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0c2d48");
    grad.addColorStop(1, "#07162c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Light rays
    ctx.save();
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "rgba(56, 189, 248, 0.045)";
      ctx.beginPath();
      ctx.moveTo(60 + i * 110, 0);
      ctx.lineTo(110 + i * 110, 0);
      ctx.lineTo(170 + i * 110 + Math.sin(t + i) * 15, h);
      ctx.lineTo(80 + i * 110 + Math.sin(t + i) * 15, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Reef floor
    ctx.fillStyle = "#112239";
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h + 15, w * 0.65, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coral rock base on right
    const anemoneX = w * 0.68;
    const anemoneY = h * 0.73;
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.ellipse(anemoneX, anemoneY + 22, 78, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sea Anemone Column
    ctx.fillStyle = "#9d174d";
    this.roundRect(ctx, anemoneX - 48, anemoneY - 22, 96, 44, 20);
    ctx.fill();

    // Swaying Tentacles
    for (let i = -6; i <= 6; i++) {
      const baseX = anemoneX + i * 7;
      const sway = Math.sin(t * 2.4 + i * 0.6) * 8;
      const tipX = baseX + sway + i * 1.5;
      const tipY = anemoneY - 72 - Math.abs(Math.cos(i * 0.4)) * 22;

      ctx.strokeStyle = s > 55 ? "#f472b6" : "#be185d";
      ctx.lineWidth = 6.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(baseX, anemoneY - 12);
      ctx.quadraticCurveTo(baseX + sway * 0.5, anemoneY - 45, tipX, tipY);
      ctx.stroke();

      // Glowing stinging tip
      ctx.fillStyle = s > 55 ? "#34d399" : "#f43f5e";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Clownfish position interpolated by slider s (0..1)
    const fishX = w * 0.22 + (anemoneX - w * 0.22) * s;
    const fishY = h * 0.46 + (anemoneY - 48 - h * 0.46) * s + Math.sin(t * 4) * 5;

    // Protective Mucus Shield aura when inside anemone
    if (s > 0.55) {
      ctx.save();
      ctx.strokeStyle = `rgba(16, 185, 129, ${(s - 0.55) * 1.8})`;
      ctx.fillStyle = `rgba(16, 185, 129, ${(s - 0.55) * 0.22})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(fishX, fishY, 42, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Draw Clownfish
    ctx.save();
    ctx.translate(fishX, fishY);
    // Tail fin
    const tailSwing = Math.sin(t * 8) * 4;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(-34, -11 + tailSwing);
    ctx.lineTo(-34, 11 + tailSwing);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = "#fb923c";
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // White stripes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-10, -11, 5, 22);
    ctx.fillRect(4, -12, 5, 24);

    // Eye
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(14, -3, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Live Telemetry Meters
    const safetyPct = 25 + s * 75;
    const anemoneBenefit = 30 + s * 70;
    this.drawMeter(16, 16, 195, "Clownfish Safety (+)", safetyPct, "#10b981");
    this.drawMeter(w - 211, 16, 195, "Anemone Cleaning (+)", anemoneBenefit, "#10b981");

    // Status Badge
    if (s > 0.6) {
      this.drawBadge(anemoneX, anemoneY + 26, "MUTUALISM [+ / +] ACTIVE", "#10b981");
    } else {
      this.drawBadge(fishX, fishY - 30, "Drag Slider → Move Into Anemone", "#4f46e5");
    }
  }

  // ==========================================================================
  // STAGE 2: REMORA & SHARK (COMMENSALISM + / 0)
  // ==========================================================================
  drawStage2(w, h, t, s) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(1, "#1e293b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Drifting food scraps
    ctx.fillStyle = "#fbbf24";
    this.particles.forEach((p, idx) => {
      const px = ((p.x - t * 0.08) % 1 + 1) * w;
      const py = h * 0.45 + Math.sin(p.phase + t * 2) * 55;
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });

    const sharkX = w * 0.52;
    const sharkY = h * 0.44 + Math.sin(t * 2.2) * 5;

    // Draw Sleek Shark
    ctx.save();
    ctx.translate(sharkX, sharkY);
    // Dorsal fin
    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(-10, -22);
    ctx.lineTo(15, -56);
    ctx.lineTo(32, -20);
    ctx.closePath();
    ctx.fill();

    // Tail fin
    const tail = Math.sin(t * 5) * 6;
    ctx.beginPath();
    ctx.moveTo(-105, 0);
    ctx.lineTo(-142, -32 + tail);
    ctx.lineTo(-128, 0);
    ctx.lineTo(-140, 26 + tail);
    ctx.closePath();
    ctx.fill();

    // Main body
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.ellipse(0, 0, 112, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // White belly
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.ellipse(5, 10, 95, 14, 0, 0, Math.PI);
    ctx.fill();

    // Eye & gills
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(82, -5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    for (let g = 0; g < 3; g++) {
      ctx.beginPath();
      ctx.moveTo(45 + g * 7, -6);
      ctx.lineTo(45 + g * 7, 8);
      ctx.stroke();
    }
    ctx.restore();

    // Remora fish attaches underneath shark as s -> 1
    const remoraX = sharkX - 35 + s * 45;
    const remoraY = h * 0.82 + (sharkY + 29 - h * 0.82) * s;

    ctx.save();
    ctx.translate(remoraX, remoraY);
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.ellipse(0, 0, 34, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Suction disc on top
    ctx.fillStyle = "#0284c7";
    this.roundRect(ctx, -12, -11, 24, 4, 2);
    ctx.fill();
    ctx.restore();

    // Meters: Remora benefits (+), Shark stays strictly 100% unaffected (0)
    this.drawMeter(16, 16, 200, "Remora Food & Transport (+)", 20 + s * 80, "#38bdf8");
    this.drawMeter(w - 216, 16, 200, "Shark Host Impact (0 Neutral)", 0, "#94a3b8");

    if (s > 0.65) {
      this.drawBadge(sharkX + 10, sharkY + 62, "COMMENSALISM [+ / 0] — Host Unaffected", "#0284c7");
    } else {
      this.drawBadge(remoraX, remoraY - 22, "Slide to Attach Suction Disc ↑", "#4f46e5");
    }
  }

  // ==========================================================================
  // STAGE 3: BIRD'S NEST FERN ON OIL PALM (X-RAY BARK SCANNER + / 0)
  // ==========================================================================
  drawStage3(w, h, t, s) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0f2922");
    grad.addColorStop(1, "#091915");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const trunkX = w * 0.5;
    const trunkW = 104;

    // Oil Palm Trunk Outer Bark
    ctx.fillStyle = "#5c4033";
    ctx.fillRect(trunkX - trunkW / 2, 0, trunkW, h);

    // Bark texture lines
    ctx.strokeStyle = "#3e2723";
    ctx.lineWidth = 2;
    for (let y = 20; y < h; y += 28) {
      ctx.beginPath();
      ctx.moveTo(trunkX - trunkW / 2, y);
      ctx.lineTo(trunkX + trunkW / 2, y + 8);
      ctx.stroke();
    }

    // X-Ray Scanner Window controlled by slider s
    const xrayHeight = 140;
    const xrayY = h * 0.52 - xrayHeight / 2;
    if (s > 0.1) {
      ctx.save();
      ctx.globalAlpha = s;
      // Internal vascular tissue inside trunk
      ctx.fillStyle = "#1e293b";
      this.roundRect(ctx, trunkX - trunkW / 2 + 8, xrayY, trunkW - 16, xrayHeight, 8);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Intact vertical sap vessels (xylem/phloem)
      for (let vx = -26; vx <= 26; vx += 17) {
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(trunkX + vx, xrayY + 6);
        ctx.lineTo(trunkX + vx, xrayY + xrayHeight - 6);
        ctx.stroke();

        // Flowing sap droplets
        const dropY = xrayY + ((t * 45 + vx * 10) % (xrayHeight - 16)) + 8;
        ctx.fillStyle = "#7dd3fc";
        ctx.beginPath();
        ctx.arc(trunkX + vx, dropY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Bird's Nest Fern perched on RIGHT outer bark surface
    const fernX = trunkX + trunkW / 2;
    const fernY = h * 0.52;

    // Spongy root mass strictly on outer bark surface
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.arc(fernX + 4, fernY, 22, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Lush green fronds radiating outward for sunlight
    const frondAngles = [-0.9, -0.55, -0.2, 0.15, 0.5];
    frondAngles.forEach((ang, i) => {
      ctx.save();
      ctx.translate(fernX + 8, fernY);
      ctx.rotate(ang + Math.sin(t * 2 + i) * 0.04);
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.ellipse(46, 0, 44, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    this.drawMeter(16, 16, 200, "Fern Sunlight Access (+)", 92, "#10b981");
    this.drawMeter(w - 216, 16, 200, "Palm Sap Stolen (0% Epiphyte)", 0, "#38bdf8");

    if (s > 0.45) {
      this.drawBadge(trunkX, h - 26, "X-RAY: Roots Cling to Outer Bark Only [+ / 0]", "#10b981");
    } else {
      this.drawBadge(trunkX, h - 26, "Slide X-Ray Scanner to Inspect Root Depth", "#4f46e5");
    }
  }

  // ==========================================================================
  // STAGE 4: RAFFLESIA & TETRASTIGMA VINE (PARASITISM + / -)
  // ==========================================================================
  drawStage4(w, h, t, s) {
    const ctx = this.ctx;
    ctx.fillStyle = "#18131a";
    ctx.fillRect(0, 0, w, h);

    const centerY = h * 0.62;
    // Host Tetrastigma Vine across floor
    ctx.strokeStyle = s > 0.6 ? "#6b5344" : "#4d7c0f";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(30, centerY);
    ctx.quadraticCurveTo(w * 0.5, centerY + 18, w - 30, centerY - 6);
    ctx.stroke();

    // Haustoria threads draining nutrients from vine into Rafflesia
    const flX = w * 0.5;
    const flY = centerY - 12;

    if (s > 0.15) {
      for (let i = 0; i < 6; i++) {
        const px = flX - 90 + i * 36;
        const prog = (t * 0.9 + i * 0.2) % 1;
        const curX = px + (flX - px) * prog;
        const curY = centerY + (flY - centerY) * prog;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(curX, curY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Giant 5-petalled crimson Rafflesia blooming larger with slider s
    const scale = 0.55 + s * 0.55;
    ctx.save();
    ctx.translate(flX, flY - 18);
    ctx.scale(scale, scale);

    for (let p = 0; p < 5; p++) {
      ctx.save();
      ctx.rotate((p * Math.PI * 2) / 5);
      ctx.fillStyle = "#be123c";
      ctx.beginPath();
      ctx.ellipse(0, -48, 30, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // White warts on petals
      ctx.fillStyle = "#ffe4e6";
      ctx.beginPath();
      ctx.arc(-8, -52, 4, 0, Math.PI * 2);
      ctx.arc(10, -44, 3.5, 0, Math.PI * 2);
      ctx.arc(0, -64, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Central corona diaphragm
    ctx.fillStyle = "#881337";
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4c0519";
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.drawMeter(16, 16, 200, "Rafflesia Nutrient Absorption (+)", 30 + s * 70, "#10b981");
    this.drawMeter(w - 216, 16, 200, "Host Vine Vitality (- Drained)", 95 - s * 65, "#f43f5e");

    this.drawBadge(flX, h - 24, "HOLOPARASITE [+ / -]: No Chlorophyll, Drains Host Vine", "#e11d48");
  }

  // ==========================================================================
  // STAGE 5: INTESTINAL TAPEWORM & HOST MAMMAL (ENDOPARASITISM + / -)
  // ==========================================================================
  drawStage5(w, h, t, s) {
    const ctx = this.ctx;
    ctx.fillStyle = "#1f1218";
    ctx.fillRect(0, 0, w, h);

    // Intestinal wall cross-section
    const topWall = h * 0.26;
    const botWall = h * 0.78;
    ctx.fillStyle = "#4c1d2e";
    ctx.fillRect(0, topWall, w, botWall - topWall);

    // Top & bottom villi walls
    ctx.fillStyle = "#be185d";
    ctx.fillRect(0, topWall - 12, w, 14);
    ctx.fillRect(0, botWall - 2, w, 14);

    // Digested nutrient droplets flowing through lumen
    this.particles.forEach((p, idx) => {
      const nx = ((p.x + t * 0.1) % 1) * w;
      let ny = topWall + 22 + (idx % 5) * 22;
      // Pull nutrients into tapeworm if s is high
      if (s > 0.3 && nx > w * 0.3) {
        ny += (h * 0.52 - ny) * s * 0.7;
      }
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Segmented Tapeworm inside lumen
    const segCount = Math.floor(8 + s * 16);
    for (let i = 0; i < segCount; i++) {
      const sx = w * 0.2 + i * 13;
      const sy = h * 0.52 + Math.sin(t * 4 + i * 0.45) * 12;
      ctx.fillStyle = i === 0 ? "#fef08a" : "#fde047";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 1.5;
      this.roundRect(ctx, sx - 7, sy - 9, 12, 18, 4);
      ctx.fill();
      ctx.stroke();
    }

    this.drawMeter(16, 16, 200, "Tapeworm Nutrient Theft (+)", 20 + s * 80, "#10b981");
    this.drawMeter(w - 216, 16, 200, "Host Cat Nutrition (- Harmed)", 95 - s * 65, "#f43f5e");
    this.drawBadge(w * 0.5, h - 22, "ENDOPARASITISM [+ / -]: Parasite Steals Digested Food", "#e11d48");
  }

  // ==========================================================================
  // STAGE 6: HERMIT CRAB & SEA ANEMONE (MUTUALISM + / +)
  // ==========================================================================
  drawStage6(w, h, t, s) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#0f2942");
    grad.addColorStop(1, "#0a1929");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sandy seabed
    ctx.fillStyle = "#b45309";
    ctx.fillRect(0, h * 0.75, w, h * 0.25);

    // Crab + Anemone moves right with slider s
    const crabX = w * 0.25 + s * (w * 0.36);
    const crabY = h * 0.72;

    // Shell
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(crabX, crabY - 18, 30, 0, Math.PI * 2);
    ctx.fill();

    // Crab legs & claws
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 5;
    for (let l = -2; l <= 2; l++) {
      if (l === 0) continue;
      ctx.beginPath();
      ctx.moveTo(crabX + l * 10, crabY - 4);
      ctx.lineTo(crabX + l * 15 + Math.sin(t * 6 + l) * 3, crabY + 12);
      ctx.stroke();
    }

    // Sea Anemone riding on top of the shell
    ctx.fillStyle = "#db2777";
    this.roundRect(ctx, crabX - 18, crabY - 62, 36, 22, 8);
    ctx.fill();

    for (let k = -4; k <= 4; k++) {
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(crabX + k * 4, crabY - 60);
      ctx.lineTo(crabX + k * 6 + Math.sin(t * 3 + k) * 4, crabY - 82);
      ctx.stroke();
    }

    // Approaching Predator retreats when crab & stinging anemone advance
    const predX = w * 0.82 + Math.max(0, s - 0.4) * 90;
    const predY = h * 0.44 + Math.sin(t * 2) * 8;
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(predX, predY, 22, 0, Math.PI * 2);
    ctx.fill();
    this.drawBadge(predX, predY - 32, s > 0.5 ? "Predator Deterred!" : "Predator Nearby", "#6366f1");

    this.drawMeter(16, 16, 195, "Crab Predator Defense (+)", 35 + s * 65, "#10b981");
    this.drawMeter(w - 211, 16, 195, "Anemone Feeding Grounds (+)", 30 + s * 70, "#10b981");
  }

  // ==========================================================================
  // STAGE 7: ECOLOGICAL OUTCOME MATRIX ([+ / +], [+ / 0], [+ / -])
  // ==========================================================================
  drawStage7(w, h, t, s) {
    const ctx = this.ctx;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    const cards = [
      { code: "[+ / +]", title: "Mutualism", ex: "Mynah & Buffalo", a: 95, b: 95, col: "#10b981" },
      { code: "[+ / 0]", title: "Commensalism", ex: "Orchid & Tree", a: 95, b: 50, col: "#38bdf8" },
      { code: "[+ / -]", title: "Parasitism", ex: "Tick & Dog", a: 95, b: 15, col: "#f43f5e" }
    ];

    const activeIdx = s < 0.34 ? 0 : s < 0.67 ? 1 : 2;
    const cardW = (w - 64) / 3;

    cards.forEach((c, i) => {
      const x = 20 + i * (cardW + 12);
      const y = 38;
      const isSelected = i === activeIdx;

      ctx.save();
      this.roundRect(ctx, x, y, cardW, h - 76, 14);
      ctx.fillStyle = isSelected ? "rgba(30, 41, 59, 0.98)" : "rgba(15, 23, 42, 0.65)";
      ctx.fill();
      ctx.strokeStyle = isSelected ? c.col : "rgba(255,255,255,0.12)";
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      ctx.fillStyle = c.col;
      ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c.code, x + cardW / 2, y + 36);

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(c.title, x + cardW / 2, y + 60);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 11px 'Inter', sans-serif";
      ctx.fillText(c.ex, x + cardW / 2, y + 80);

      // Species A & B fitness bars
      ctx.textAlign = "left";
      ctx.font = "600 10px 'Inter', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Species A (+)", x + 14, y + 115);
      this.roundRect(ctx, x + 14, y + 122, (cardW - 28) * (c.a / 100), 8, 4);
      ctx.fillStyle = "#10b981";
      ctx.fill();

      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(i === 0 ? "Species B (+)" : i === 1 ? "Species B (0)" : "Host B (-)", x + 14, y + 155);
      this.roundRect(ctx, x + 14, y + 162, (cardW - 28) * (c.b / 100), 8, 4);
      ctx.fillStyle = i === 0 ? "#10b981" : i === 1 ? "#94a3b8" : "#f43f5e";
      ctx.fill();

      ctx.restore();
    });

    this.drawBadge(w * 0.5, h - 18, "Slide to Inspect Ecological Outcome Codes", "#4f46e5");
  }

  // ==========================================================================
  // STAGE 8: PLANT COMPETITION — CROWDED VS SPACED SAPLINGS
  // ==========================================================================
  drawStage8(w, h, t, s) {
    const ctx = this.ctx;
    ctx.fillStyle = "#0f1f1c";
    ctx.fillRect(0, 0, w, h);

    const potY = h * 0.74;
    // Left Pot: Crowded (density controlled by slider s)
    const leftX = w * 0.28;
    const rightX = w * 0.72;

    // Draw pots
    [leftX, rightX].forEach((px) => {
      ctx.fillStyle = "#9a3412";
      this.roundRect(ctx, px - 68, potY, 136, 52, 8);
      ctx.fill();
    });

    // Left Pot saplings: count increases from 4 to 18 with slider s, height shrinks
    const crowdedCount = Math.floor(4 + s * 14);
    const crowdedHeight = 82 - s * 42;
    for (let i = 0; i < crowdedCount; i++) {
      const sx = leftX - 52 + (i / Math.max(1, crowdedCount - 1)) * 104;
      ctx.strokeStyle = s > 0.5 ? "#eab308" : "#22c55e";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx, potY);
      ctx.lineTo(sx + Math.sin(i) * 4, potY - crowdedHeight);
      ctx.stroke();

      ctx.fillStyle = s > 0.5 ? "#facc15" : "#4ade80";
      ctx.beginPath();
      ctx.arc(sx + Math.sin(i) * 4, potY - crowdedHeight, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Right Pot: 3 Spaced, healthy tall green saplings
    [-38, 0, 38].forEach((offset) => {
      const sx = rightX + offset;
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(sx, potY);
      ctx.lineTo(sx, potY - 94);
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.ellipse(sx - 9, potY - 88, 10, 5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(sx + 9, potY - 88, 10, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    this.drawMeter(16, 16, 200, "Pot A Resource Per Plant", 90 - s * 72, "#f59e0b");
    this.drawMeter(w - 216, 16, 200, "Pot B Spaced Growth (+)", 96, "#10b981");
    this.drawBadge(leftX, potY + 26, `Pot A: ${crowdedCount} Crowded Saplings`, "#d97706");
    this.drawBadge(rightX, potY + 26, "Pot B: 3 Spaced Saplings", "#10b981");
  }

  // ==========================================================================
  // STAGE 9: BIOLOGICAL CONTROL — BARN OWLS & RATS IN OIL PALM ESTATE
  // ==========================================================================
  drawStage9(w, h, t, s) {
    const ctx = this.ctx;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    const owlCount = Math.round(1 + s * 9);
    const ratPct = Math.round(92 - s * 78);
    const yieldPct = Math.round(32 + s * 64);

    // Live Population Graph Card inside viewport
    const gx = 32;
    const gy = 76;
    const gw = w - 64;
    const gh = h - 118;

    this.roundRect(ctx, gx, gy, gw, gh, 14);
    ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.stroke();

    // Draw Yield Rising Curve & Rat Falling Curve up to current slider s
    ctx.save();
    // Rat Pest Line (Rose)
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(gx + 24, gy + 30);
    ctx.quadraticCurveTo(gx + gw * 0.5, gy + 30 + s * (gh - 60), gx + gw - 24, gy + gh - 25 - (1 - s) * 90);
    ctx.stroke();

    // Palm Fruit Yield Line (Emerald)
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(gx + 24, gy + gh - 28);
    ctx.quadraticCurveTo(gx + gw * 0.5, gy + gh - 28 - s * (gh - 60), gx + gw - 24, gy + 28 + (1 - s) * 90);
    ctx.stroke();
    ctx.restore();

    // Animated Swooping Owl icon
    const owlX = gx + 45 + s * (gw - 90);
    const owlY = gy + 48 + Math.sin(t * 4) * 6;
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.ellipse(owlX, owlY, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(owlX - 5, owlY - 1, 2.5, 0, Math.PI * 2);
    ctx.arc(owlX + 5, owlY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    this.drawMeter(16, 16, 200, `Rat Pest Population ↓`, ratPct, "#f43f5e");
    this.drawMeter(w - 216, 16, 200, `Oil Palm Fruit Yield ↑`, yieldPct, "#10b981");
    this.drawBadge(w * 0.5, h - 20, `Bio-Control Active: ${owlCount} Barn Owls Hunting Rats`, "#10b981");
  }

  // ==========================================================================
  // STAGE 10: FINAL ECOSYSTEM SYNTHESIS NETWORK
  // ==========================================================================
  drawStage10(w, h, t, s) {
    const ctx = this.ctx;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.52;
    const nodes = [
      { x: cx - 145, y: cy - 55, label: "Mutualism [+ / +]", sub: "Rhizobium & Legume", col: "#10b981" },
      { x: cx + 145, y: cy - 55, label: "Commensalism [+ / 0]", sub: "Barnacles & Whale", col: "#38bdf8" },
      { x: cx - 145, y: cy + 65, label: "Parasitism [+ / -]", sub: "Mistletoe & Mango", col: "#f43f5e" },
      { x: cx + 145, y: cy + 65, label: "Competition [- / -]", sub: "Intraspecific / Inter", col: "#f59e0b" }
    ];

    // Connecting lines
    nodes.forEach((n, i) => {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();

      // Pulse dot along line
      const p = (t * 0.6 + i * 0.25) % 1;
      ctx.fillStyle = n.col;
      ctx.beginPath();
      ctx.arc(cx + (n.x - cx) * p, cy + (n.y - cy) * p, 4, 0, Math.PI * 2);
      ctx.fill();

      // Node card
      this.roundRect(ctx, n.x - 78, n.y - 24, 156, 48, 10);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.strokeStyle = n.col;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 11.5px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(n.label, n.x, n.y - 4);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 10px 'Inter', sans-serif";
      ctx.fillText(n.sub, n.x, n.y + 12);
    });

    // Center hub
    this.roundRect(ctx, cx - 64, cy - 26, 128, 52, 999);
    ctx.fillStyle = "#4f46e5";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 12px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("UNIT 4 SYNTHESIS", cx, cy + 4);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.ctx) return;

    this.time += 0.016;
    this.simValue += (this.targetSimValue - this.simValue) * 0.12;
    const s = this.simValue / 100;
    const w = this.width;
    const h = this.height;

    this.ctx.clearRect(0, 0, w, h);

    switch (this.currentStage) {
      case 1: this.drawStage1(w, h, this.time, s); break;
      case 2: this.drawStage2(w, h, this.time, s); break;
      case 3: this.drawStage3(w, h, this.time, s); break;
      case 4: this.drawStage4(w, h, this.time, s); break;
      case 5: this.drawStage5(w, h, this.time, s); break;
      case 6: this.drawStage6(w, h, this.time, s); break;
      case 7: this.drawStage7(w, h, this.time, s); break;
      case 8: this.drawStage8(w, h, this.time, s); break;
      case 9: this.drawStage9(w, h, this.time, s); break;
      default: this.drawStage10(w, h, this.time, s); break;
    }

    if (this.pulseEffect > 0.01) {
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(16, 185, 129, ${this.pulseEffect})`;
      this.ctx.lineWidth = 6;
      this.ctx.strokeRect(3, 3, w - 6, h - 6);
      this.ctx.restore();
      this.pulseEffect *= 0.9;
    }
  }
}

window.EcoSimEngine = EcoSimEngine;
