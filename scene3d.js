// ============================================================================
// ECOQUEST 3D — ISOMETRIC 3D DIORAMA ENGINE (Three.js "3D Iso" Edition)
// Chunky 3D Isometric Cutaway Blocks + Detailed Sculpted 3D Animals & Plants
// ============================================================================

class EcoSimEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === "undefined") return;

    this.currentStage = 1;
    this.simValue = 80;
    this.targetSimValue = 80;
    this.clock = new THREE.Clock();
    this.actors = {};
    this.pins = [];
    this.isQuizLayout = true;

    // Balanced 3D Isometric Three-Quarter Camera Angle with pulled-back framing
    this.camState = {
      theta: 0.42,
      phi: 1.12,
      radius: 21.0,
      targetTheta: 0.42,
      targetPhi: 1.12,
      targetRadius: 21.0,
      autoOrbit: true,
      isDragging: false,
      lastX: 0,
      lastY: 0
    };

    this.initThree();
    this.initLights();
    this.initAmbientParticles();
    this.bindInteraction();
    this.buildStage(1, 80);
    this.animate();
  }

  initThree() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.014);

    // 35° FOV + 21-unit distance frames the entire 3D Isometric Cube with generous breathing room
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 160);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    this.dioramaGroup = new THREE.Group();
    this.scene.add(this.dioramaGroup);

    this.updateCenterOffset();
    window.addEventListener("resize", () => this.resize());
  }

  initLights() {
    const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 0.95);
    this.scene.add(hemi);

    this.keyLight = new THREE.DirectionalLight(0xfffbeb, 1.65);
    this.keyLight.position.set(9, 16, 10);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 40;
    const d = 6;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.PointLight(0x38bdf8, 1.6, 28);
    this.rimLight.position.set(-8, 6, -7);
    this.scene.add(this.rimLight);

    this.fillLight = new THREE.PointLight(0x10b981, 1.1, 24);
    this.fillLight.position.set(6, -2, 6);
    this.scene.add(this.fillLight);
  }

  initAmbientParticles() {
    const count = 90;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.12,
      transparent: true,
      opacity: 0.55
    });
    this.particleSystem = new THREE.Points(geo, mat);
    this.scene.add(this.particleSystem);
  }

  bindInteraction() {
    const dom = this.renderer.domElement;

    dom.addEventListener("pointerdown", (e) => {
      this.camState.isDragging = true;
      this.camState.lastX = e.clientX;
      this.camState.lastY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!this.camState.isDragging) return;
      const dx = e.clientX - this.camState.lastX;
      const dy = e.clientY - this.camState.lastY;
      this.camState.lastX = e.clientX;
      this.camState.lastY = e.clientY;

      this.camState.targetTheta -= dx * 0.007;
      this.camState.targetPhi = Math.max(
        0.48,
        Math.min(1.42, this.camState.targetPhi - dy * 0.006)
      );
    });

    window.addEventListener("pointerup", () => {
      this.camState.isDragging = false;
    });

    dom.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.camState.targetRadius = Math.max(
          13.0,
          Math.min(30.0, this.camState.targetRadius + e.deltaY * 0.008)
        );
      },
      { passive: false }
    );
  }

  setLayoutMode(isQuiz) {
    this.isQuizLayout = isQuiz;
    this.updateCenterOffset();
  }

  updateCenterOffset() {
    if (!this.camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.isQuizLayout && w > 960) {
      // Shift frustum window so (0,0,0) renders cleanly in the open left 58% of the screen with ZERO angle distortion
      this.camera.setViewOffset(w, h, Math.round(w * 0.17), Math.round(h * 0.05), w, h);
    } else {
      this.camera.clearViewOffset();
    }
    this.camera.updateProjectionMatrix();
  }

  setCameraPreset(preset) {
    if (preset === "front") {
      // Balanced Three-Quarter Isometric View
      this.camState.targetTheta = 0.42;
      this.camState.targetPhi = 1.12;
      this.camState.targetRadius = 21.0;
    } else if (preset === "top") {
      // High 45° Isometric Corner Overview
      this.camState.targetTheta = Math.PI / 4;
      this.camState.targetPhi = 0.82;
      this.camState.targetRadius = 22.5;
    } else if (preset === "closeup") {
      this.camState.targetTheta = 0.28;
      this.camState.targetPhi = 1.18;
      this.camState.targetRadius = 15.0;
    } else if (preset === "orbit") {
      this.camState.autoOrbit = !this.camState.autoOrbit;
      const btn = document.getElementById("btn-cam-orbit");
      if (btn) btn.classList.toggle("active", this.camState.autoOrbit);
    }
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.renderer.setSize(w, h);
    this.updateCenterOffset();
  }

  setSimValue(val) {
    this.targetSimValue = Math.max(0, Math.min(100, Number(val)));
  }

  triggerFeedbackPulse() {
    const prev = this.camState.targetRadius;
    this.camState.targetRadius = Math.max(15.0, prev - 2.2);
    setTimeout(() => {
      this.camState.targetRadius = prev;
    }, 450);
  }

  clearDiorama() {
    while (this.dioramaGroup.children.length > 0) {
      this.dioramaGroup.remove(this.dioramaGroup.children[0]);
    }
    this.actors = {};
    this.pins = [];
  }

  // ==========================================================================
  // 3D ISOMETRIC CUTAWAY DIORAMA CUBE BUILDER ("3D Iso" Block + Water Volume)
  // ==========================================================================
  createIsoBlock({
    topColor = 0xd97706,
    midColor = 0x78350f,
    baseColor = 0x1e293b,
    waterColor = null,
    waterHeight = 2.7,
    size = 5.2
  } = {}) {
    const block = new THREE.Group();

    // 1. Dark Slate Isometric Base Frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(size + 0.25, 0.38, size + 0.25),
      new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.5, metalness: 0.2 })
    );
    frame.position.y = -2.25;
    frame.receiveShadow = true;
    block.add(frame);

    // 2. Sub-soil / Earth Cutaway Layer
    const mid = new THREE.Mesh(
      new THREE.BoxGeometry(size, 0.65, size),
      new THREE.MeshStandardMaterial({ color: midColor, roughness: 0.75 })
    );
    mid.position.y = -1.75;
    mid.receiveShadow = true;
    block.add(mid);

    // 3. Top Biome Surface Tile (Sand / Grass / Reef / Forest Floor)
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(size, 0.34, size),
      new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.6 })
    );
    top.position.y = -1.26;
    top.receiveShadow = true;
    block.add(top);

    // 4. Optional Translucent 3D Isometric Aquarium Water Cube
    if (waterColor !== null) {
      const waterCube = new THREE.Mesh(
        new THREE.BoxGeometry(size - 0.04, waterHeight, size - 0.04),
        new THREE.MeshStandardMaterial({
          color: waterColor,
          transparent: true,
          opacity: 0.22,
          roughness: 0.15,
          metalness: 0.1,
          depthWrite: false
        })
      );
      waterCube.position.y = -1.09 + waterHeight / 2;
      block.add(waterCube);

      // Crisp Isometric Water Surface Rim
      const rim = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size, waterHeight, size)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
      );
      rim.position.y = -1.09 + waterHeight / 2;
      block.add(rim);
    } else {
      // Subtle Isometric Grid Frame Outline
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size + 0.26, 0.38, size + 0.26)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 })
      );
      outline.position.y = -2.25;
      block.add(outline);
    }

    // Add 3D Isometric Pebbles on corners
    const pebMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true });
    [
      [-2.1, -1.9],
      [2.1, -2.0],
      [-2.0, 2.1]
    ].forEach(([px, pz], idx) => {
      const peb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22 + idx * 0.05, 0), pebMat);
      peb.scale.set(1.2, 0.65, 1.0);
      peb.position.set(px, -1.05, pz);
      peb.castShadow = true;
      block.add(peb);
    });

    this.dioramaGroup.add(block);
    return block;
  }

  // Helper: Add 3D Eyes with White Sclera + Dark Pupils (gives that charming "fish visual" look!)
  add3DEyes(parent, x, y, zSpread, radius = 0.09) {
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

    [-zSpread, zSpread].forEach((z) => {
      const sign = z >= 0 ? 1 : -1;
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(x, y, z);

      const white = new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 14), scleraMat);
      eyeGroup.add(white);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.58, 12, 12), pupilMat);
      pupil.position.set(radius * 0.45, 0, sign * radius * 0.48);
      eyeGroup.add(pupil);

      parent.add(eyeGroup);
    });
  }

  // Helper: Sculpted 3D Clownfish (the signature look the user loved!)
  createClownfish3D(scale = 1.0) {
    const fish = new THREE.Group();
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.28 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22 });
    const blackTrimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });

    // Plump sculpted body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 24), orangeMat);
    body.scale.set(1.55, 0.92, 0.72);
    body.castShadow = true;
    fish.add(body);

    // White Stripes with dark rims
    [0.2, -0.22].forEach((sx, idx) => {
      const r = idx === 0 ? 0.41 : 0.36;
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.15, 20), whiteMat);
      stripe.rotation.z = Math.PI / 2;
      stripe.scale.set(0.92, 1, 0.74);
      stripe.position.x = sx;
      fish.add(stripe);

      const trim = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.005, r + 0.005, 0.19, 20), blackTrimMat);
      trim.rotation.z = Math.PI / 2;
      trim.scale.set(0.91, 1, 0.73);
      trim.position.x = sx;
      fish.add(trim);
    });

    // Dorsal Fin on top
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 4), orangeMat);
    dorsal.position.set(-0.05, 0.45, 0);
    dorsal.rotation.z = 0.35;
    dorsal.scale.set(1.3, 0.8, 0.25);
    fish.add(dorsal);

    // Side Pectoral Fins
    [-0.34, 0.34].forEach((z) => {
      const pec = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.34, 4), orangeMat);
      pec.position.set(0.12, -0.08, z);
      pec.rotation.x = z > 0 ? 1.2 : -1.2;
      fish.add(pec);
    });

    // Articulated Tail Fin
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.55, 4), orangeMat);
    tail.rotation.z = -Math.PI / 2;
    tail.scale.set(1, 1, 0.32);
    tail.position.x = -0.8;
    fish.add(tail);
    fish.userData.tail = tail;

    this.add3DEyes(fish, 0.48, 0.1, 0.22, 0.085);

    // Mucus Shield Aura
    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.2, wireframe: true })
    );
    fish.add(shield);
    fish.userData.shield = shield;

    fish.scale.setScalar(scale);
    return fish;
  }

  addPin(name, effect, color, worldPosVec3) {
    this.pins.push({ name, effect, color, pos: worldPosVec3, el: null });
  }

  rebuildPinDOM() {
    const overlay = document.getElementById("pins-overlay");
    if (!overlay) return;
    overlay.innerHTML = "";
    this.pins.forEach((p) => {
      const div = document.createElement("div");
      div.className = "pin-3d";
      div.innerHTML = `
        <span class="pin-dot" style="background:${p.color}; color:${p.color}"></span>
        <span class="pin-name">${p.name}</span>
        <span class="pin-effect" style="color:${p.color}">${p.effect}</span>
      `;
      div.onclick = () => this.setCameraPreset("closeup");
      overlay.appendChild(div);
      p.el = div;
    });
  }

  updateProjectedPins() {
    if (!this.camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.pins.forEach((p) => {
      if (!p.el) return;
      const v = p.pos.clone();
      v.applyMatrix4(this.dioramaGroup.matrixWorld);
      v.project(this.camera);
      if (v.z > 1) {
        p.el.style.display = "none";
        return;
      }
      p.el.style.display = "flex";
      p.el.style.left = `${(v.x * 0.5 + 0.5) * w}px`;
      p.el.style.top = `${(-(v.y * 0.5) + 0.5) * h}px`;
    });
  }

  buildStage(stageId, defaultSim = 80) {
    this.currentStage = stageId;
    this.simValue = defaultSim;
    this.targetSimValue = defaultSim;
    this.clearDiorama();

    switch (stageId) {
      case 1: this.buildStage1_ReefMutualism(); break;
      case 2: this.buildStage2_SharkRemora(); break;
      case 3: this.buildStage3_FernPalmXRay(); break;
      case 4: this.buildStage4_Rafflesia(); break;
      case 5: this.buildStage5_CatTapeworm(); break;
      case 6: this.buildStage6_HermitCrabOctopus(); break;
      case 7: this.buildStage7_IsoTrioModels(); break;
      case 8: this.buildStage8_SaplingCompetition(); break;
      case 9: this.buildStage9_BarnOwlRatEstate(); break;
      default: this.buildStage10_IsoMasterIsland(); break;
    }

    this.rebuildPinDOM();
  }

  // ==========================================================================
  // STAGE 1: 3D ISO AQUARIUM — CLOWNFISH & SEA ANEMONE (+ / +)
  // ==========================================================================
  buildStage1_ReefMutualism() {
    this.createIsoBlock({
      topColor: 0xfbbf24,
      midColor: 0xb45309,
      waterColor: 0x0ea5e9,
      waterHeight: 3.1
    });

    // Coral Rock & Brain Coral Props
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.25, 1),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, flatShading: true })
    );
    rock.scale.set(1.25, 0.65, 1.15);
    rock.position.set(0.85, -0.85, 0);
    this.dioramaGroup.add(rock);

    const brainCoral = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.45, 1),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5, flatShading: true })
    );
    brainCoral.position.set(-1.4, -0.85, 1.3);
    this.dioramaGroup.add(brainCoral);

    // 3D Sea Anemone
    const anemGroup = new THREE.Group();
    anemGroup.position.set(0.85, -0.35, 0);
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.88, 1.02, 0.7, 24),
      new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.4 })
    );
    anemGroup.add(col);

    const tentacles = [];
    const tentMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const rad = i % 2 === 0 ? 0.64 : 0.34;
      const tPivot = new THREE.Group();
      tPivot.position.set(Math.cos(angle) * rad, 0.3, Math.sin(angle) * rad);

      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.095, 1.2, 12), tentMat);
      stalk.position.y = 0.6;
      tPivot.add(stalk);

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), tipMat);
      tip.position.y = 1.22;
      tPivot.add(tip);

      tPivot.userData = { phase: i * 0.5 };
      anemGroup.add(tPivot);
      tentacles.push(tPivot);
    }
    this.dioramaGroup.add(anemGroup);
    this.actors.tentacles = tentacles;

    // 3D Clownfish
    const fish = this.createClownfish3D(1.0);
    fish.position.set(0.6, 0.7, 0.15);
    this.dioramaGroup.add(fish);
    this.actors.clownfish = fish;

    this.addPin("Clownfish", "+ Protected Shelter", "#10b981", new THREE.Vector3(0.6, 1.5, 0.15));
    this.addPin("Sea Anemone", "+ Cleaned & Defended", "#38bdf8", new THREE.Vector3(1.15, 0.15, -0.5));
  }

  // ==========================================================================
  // STAGE 2: 3D ISO OCEAN CUBE — SCULPTED 3D SHARK & 3D REMORA (+ / 0)
  // ==========================================================================
  buildStage2_SharkRemora() {
    this.createIsoBlock({
      topColor: 0x334155,
      midColor: 0x1e293b,
      waterColor: 0x0284c7,
      waterHeight: 3.3
    });

    const shark = new THREE.Group();
    const sharkMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.15 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 });

    // Plump 3D Iso Shark Body (Toy-like sculpted proportions matching the fish style!)
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.82, 28, 28), sharkMat);
    body.scale.set(2.35, 0.85, 0.92);
    body.castShadow = true;
    shark.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.76, 24, 24), bellyMat);
    belly.scale.set(2.15, 0.62, 0.86);
    belly.position.y = -0.18;
    shark.add(belly);

    // Iconic Tall Dorsal Fin
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.05, 4), sharkMat);
    dorsal.scale.set(1.25, 1, 0.28);
    dorsal.position.set(-0.05, 0.88, 0);
    dorsal.rotation.z = -0.22;
    shark.add(dorsal);

    // Pectoral Fins
    [-0.82, 0.82].forEach((z) => {
      const pec = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.0, 4), sharkMat);
      pec.position.set(0.25, -0.22, z);
      pec.rotation.x = z > 0 ? 1.25 : -1.25;
      shark.add(pec);
    });

    // Crescent Tail Fin
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.15, 4), sharkMat);
    tail.position.set(-2.05, 0.1, 0);
    tail.rotation.z = -Math.PI / 2;
    tail.scale.set(1, 1, 0.28);
    shark.add(tail);
    shark.userData.tail = tail;

    // 3D Eyes & Gill Slits
    this.add3DEyes(shark, 1.25, 0.15, 0.46, 0.11);

    shark.position.set(0, 0.68, 0);
    this.dioramaGroup.add(shark);
    this.actors.shark = shark;

    // Sculpted 3D Remora Fish with Eyes, Fins & Suction Disc
    const remora = new THREE.Group();
    const remMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.28 });
    const remBody = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), remMat);
    remBody.scale.set(2.1, 0.62, 0.68);
    remora.add(remBody);

    const remTail = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.4, 4), remMat);
    remTail.rotation.z = -Math.PI / 2;
    remTail.position.x = -0.72;
    remora.add(remTail);

    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x0369a1 })
    );
    pad.scale.set(1.6, 1, 0.7);
    pad.position.set(0.1, 0.19, 0);
    remora.add(pad);

    this.add3DEyes(remora, 0.44, 0.04, 0.16, 0.055);

    remora.position.set(0.15, 0.05, 0);
    this.dioramaGroup.add(remora);
    this.actors.remora = remora;

    this.addPin("3D Shark Host", "0 Unaffected (100% Energy)", "#94a3b8", new THREE.Vector3(0.1, 1.75, 0));
    this.addPin("3D Remora Fish", "+ Transport & Food Scraps", "#38bdf8", new THREE.Vector3(0.2, -0.35, 0.45));
  }

  // ==========================================================================
  // STAGE 3: 3D ISO RAINFOREST — OIL PALM & BIRD'S NEST FERN (+ / 0)
  // ==========================================================================
  buildStage3_FernPalmXRay() {
    this.createIsoBlock({ topColor: 0x16a34a, midColor: 0x78350f });

    // Ringed 3D Oil Palm Trunk with Crown Fronds & Red Fruit Bunches
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x6b4423,
      roughness: 0.8,
      transparent: true,
      opacity: 0.92
    });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.88, 3.6, 20), trunkMat);
    trunk.position.y = 0.7;
    trunk.castShadow = true;
    this.dioramaGroup.add(trunk);
    this.actors.palmTrunk = trunk;

    // Palm Crown Fronds at top of tree
    const crownGroup = new THREE.Group();
    crownGroup.position.y = 2.45;
    const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), palmLeafMat);
      frond.scale.set(2.1, 0.18, 0.55);
      frond.position.set(Math.cos(ang) * 0.95, 0.1, Math.sin(ang) * 0.95);
      frond.rotation.y = -ang;
      frond.rotation.z = -0.35;
      crownGroup.add(frond);
    }
    // Red-Orange Oil Palm Fruit Bunches
    const fruitMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35 });
    [-0.48, 0.48].forEach((fx) => {
      const bunch = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 14), fruitMat);
      bunch.position.set(fx, -0.25, 0.35);
      crownGroup.add(bunch);
    });
    this.dioramaGroup.add(crownGroup);

    // Internal Glowing Blue Vascular Sap Tubes (Revealed by X-Ray Slider)
    const sapMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-0.24, 0, 0.24].forEach((x) => {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.5, 12), sapMat);
      tube.position.set(x, 0.7, 0);
      this.dioramaGroup.add(tube);
    });

    // 3D X-Ray Scanner Ring
    const xrayRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.98, 0.05, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    xrayRing.rotation.x = Math.PI / 2;
    xrayRing.position.y = 0.5;
    this.dioramaGroup.add(xrayRing);
    this.actors.xrayRing = xrayRing;

    // Sculpted 3D Bird's Nest Fern Rosette on Right Bark
    const fern = new THREE.Group();
    fern.position.set(0.75, 0.55, 0);
    const nest = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    fern.add(nest);

    const fernLeafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), fernLeafMat);
      leaf.scale.set(1.85, 0.16, 0.48);
      leaf.position.set(0.45 + Math.cos(ang) * 0.25, 0.35, Math.sin(ang) * 0.45);
      leaf.rotation.z = 0.55;
      leaf.rotation.y = ang * 0.4;
      fern.add(leaf);
    }
    this.dioramaGroup.add(fern);

    this.addPin("Bird's Nest Fern", "+ Sunlit Canopy Epiphyte", "#10b981", new THREE.Vector3(1.45, 1.3, 0));
    this.addPin("Oil Palm Trunk", "0 Vascular Sap Untouched", "#38bdf8", new THREE.Vector3(-0.75, 0.85, 0));
  }

  // ==========================================================================
  // STAGE 4: 3D ISO JUNGLE FLOOR — GIANT RAFFLESIA, VINE & 3D FLIES (+ / -)
  // ==========================================================================
  buildStage4_Rafflesia() {
    this.createIsoBlock({ topColor: 0x14532d, midColor: 0x451a03 });

    // Woody Tetrastigma Vine with 3D Leaves
    const vine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.28, 4.8, 20),
      new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.7 })
    );
    vine.rotation.z = Math.PI / 2;
    vine.position.y = -0.9;
    this.dioramaGroup.add(vine);

    // Sculpted 5-Petalled 3D Rafflesia with Raised Warts & Corona
    const rafflesia = new THREE.Group();
    rafflesia.position.set(0, -0.55, 0);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.38 });
    const wartMat = new THREE.MeshStandardMaterial({ color: 0xffe4e6 });

    for (let i = 0; i < 5; i++) {
      const pGroup = new THREE.Group();
      pGroup.rotation.y = (i * Math.PI * 2) / 5;

      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.78, 20, 20), petalMat);
      petal.scale.set(0.95, 0.24, 1.2);
      petal.position.set(0, 0.15, 1.05);
      petal.rotation.x = -0.2;
      pGroup.add(petal);

      [-0.22, 0.22, 0].forEach((wx, idx) => {
        const wart = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), wartMat);
        wart.position.set(wx, 0.32, 0.95 + idx * 0.2);
        pGroup.add(wart);
      });
      rafflesia.add(pGroup);
    }

    const corona = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.22, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.45 })
    );
    corona.rotation.x = Math.PI / 2;
    corona.position.y = 0.24;
    rafflesia.add(corona);

    this.dioramaGroup.add(rafflesia);
    this.actors.rafflesia = rafflesia;

    this.addPin("3D Rafflesia Flower", "+ Drains Host Vine Sap", "#f43f5e", new THREE.Vector3(0, 0.95, 0));
    this.addPin("Tetrastigma Vine", "- Weakened Host", "#f59e0b", new THREE.Vector3(-1.85, -0.45, 0));
  }

  // ==========================================================================
  // STAGE 5: 3D ISO VET LAB — SCULPTED 3D CAT HOST & 3D TAPEWORM (+ / -)
  // ==========================================================================
  buildStage5_CatTapeworm() {
    this.createIsoBlock({ topColor: 0x334155, midColor: 0x1e293b });

    // 1. Sculpted 3D Ginger Cat (Host Mammal) on Left Side of Isometric Block
    const cat = new THREE.Group();
    cat.position.set(-1.15, -0.45, 0.35);
    const furMat = new THREE.MeshStandardMaterial({ color: 0xfb923c, roughness: 0.45 });
    const earMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });

    // Cat Torso
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), furMat);
    torso.scale.set(1.45, 0.95, 0.88);
    torso.castShadow = true;
    cat.add(torso);

    // Cat Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.46, 20, 20), furMat);
    head.position.set(0.68, 0.45, 0);
    cat.add(head);

    // Pointy Cat Ears
    [-0.24, 0.24].forEach((z) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.34, 4), furMat);
      ear.position.set(0.68, 0.92, z);
      cat.add(ear);
    });

    this.add3DEyes(cat, 1.05, 0.52, 0.18, 0.075);

    // Pink Nose & Tail
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), earMat);
    nose.position.set(1.12, 0.42, 0);
    cat.add(nose);

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.95, 12), furMat);
    tail.position.set(-0.85, 0.35, 0);
    tail.rotation.z = 0.55;
    cat.add(tail);

    this.dioramaGroup.add(cat);
    this.actors.cat = cat;

    // 2. Magnified 3D Intestine Cutaway & Segmented 3D Tapeworm with Scolex Head
    const wormSegments = [];
    const segMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 });
    for (let i = 0; i < 16; i++) {
      const seg = new THREE.Mesh(
        i === 0 ? new THREE.SphereGeometry(0.24, 16, 16) : new THREE.BoxGeometry(0.18, 0.32, 0.14),
        segMat
      );
      seg.position.set(-0.1 + i * 0.16, 0.65, -0.35);
      if (i === 0) this.add3DEyes(seg, 0.12, 0.08, 0.1, 0.05);
      this.dioramaGroup.add(seg);
      wormSegments.push(seg);
    }
    this.actors.wormSegments = wormSegments;

    this.addPin("3D Tapeworm (Parasite)", "+ Absorbs Digested Food", "#10b981", new THREE.Vector3(1.1, 1.35, -0.35));
    this.addPin("3D Host Cat", "- Deprived of Nutrients", "#f43f5e", new THREE.Vector3(-1.0, 0.95, 0.35));
  }

  // ==========================================================================
  // STAGE 6: 3D ISO TIDEPOOL — 3D HERMIT CRAB + ANEMONE VS. 3D OCTOPUS (+ / +)
  // ==========================================================================
  buildStage6_HermitCrabOctopus() {
    this.createIsoBlock({
      topColor: 0xf59e0b,
      midColor: 0x92400e,
      waterColor: 0x0ea5e9,
      waterHeight: 3.1
    });

    // Sculpted 3D Hermit Crab with Spiral Shell, Stalked Eyes, Pincers & Riding Anemone
    const crabGroup = new THREE.Group();
    crabGroup.position.set(-0.7, -0.7, 0);

    const shell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.78, 1),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45 })
    );
    shell.scale.set(1.2, 0.95, 1.0);
    crabGroup.add(shell);

    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 });
    [-0.48, 0.48].forEach((z) => {
      const claw = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), redMat);
      claw.scale.set(1.5, 0.75, 0.7);
      claw.position.set(0.85, -0.18, z);
      crabGroup.add(claw);
    });

    this.add3DEyes(crabGroup, 0.72, 0.22, 0.22, 0.085);

    // Sea Anemone on top of shell
    const anem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.48, 0.48, 18),
      new THREE.MeshStandardMaterial({ color: 0xdb2777 })
    );
    anem.position.y = 0.85;
    crabGroup.add(anem);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const t = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 0.55, 8),
        new THREE.MeshBasicMaterial({ color: 0xf472b6 })
      );
      t.position.set(Math.cos(ang) * 0.28, 1.25, Math.sin(ang) * 0.28);
      crabGroup.add(t);
    }
    this.dioramaGroup.add(crabGroup);
    this.actors.crabGroup = crabGroup;

    // Sculpted 3D Octopus Predator with Expressive Eyes & 8 Tentacles
    const octo = new THREE.Group();
    const octoMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.35 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 22, 22), octoMat);
    head.scale.set(1.0, 1.2, 1.0);
    octo.add(head);

    this.add3DEyes(octo, -0.48, -0.05, 0.26, 0.11);

    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 0.75, 10), octoMat);
      arm.position.set(Math.cos(ang) * 0.45, -0.65, Math.sin(ang) * 0.45);
      arm.rotation.z = Math.cos(ang) * 0.4;
      octo.add(arm);
    }

    octo.position.set(1.65, 0.55, 0);
    this.dioramaGroup.add(octo);
    this.actors.octo = octo;

    this.addPin("Hermit Crab & Anemone", "+ Shield & Mobility [+ / +]", "#10b981", new THREE.Vector3(-0.6, 1.25, 0));
    this.addPin("3D Octopus Predator", "Repelled by Stings!", "#a855f7", new THREE.Vector3(1.65, 1.45, 0));
  }

  // ==========================================================================
  // STAGE 7: 3D ISO TRIO — 3D BUFFALO & MYNAH, 3D ORCHID, 3D DOG & TICK
  // ==========================================================================
  buildStage7_IsoTrioModels() {
    this.createIsoBlock({ topColor: 0x15803d, midColor: 0x78350f, size: 5.8 });

    // 1. Left: 3D Buffalo + Mynah Bird [+ / +]
    const buffalo = new THREE.Group();
    buffalo.position.set(-1.75, -0.5, 0);
    const bufMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    const bBody = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), bufMat);
    bBody.scale.set(1.35, 0.95, 0.9);
    buffalo.add(bBody);

    const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), bufMat);
    bHead.position.set(0.62, 0.25, 0);
    buffalo.add(bHead);
    this.add3DEyes(buffalo, 0.9, 0.32, 0.18, 0.065);

    // Mynah bird perched on Buffalo's back
    const bird = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    bird.position.set(-0.1, 0.65, 0);
    buffalo.add(bird);
    this.dioramaGroup.add(buffalo);

    // 2. Center: 3D Tree Trunk + Wild Orchid [+ / 0]
    const tree = new THREE.Group();
    tree.position.set(0, -0.35, 0);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.4, 1.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    tree.add(trunk);
    const orchid = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.28, 0),
      new THREE.MeshStandardMaterial({ color: 0xe879f9, roughness: 0.3 })
    );
    orchid.position.set(0.35, 0.2, 0);
    tree.add(orchid);
    this.dioramaGroup.add(tree);

    // 3. Right: 3D Brown Dog + Red Tick [+ / -]
    const dog = new THREE.Group();
    dog.position.set(1.75, -0.55, 0);
    const dogMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.45 });
    const dBody = new THREE.Mesh(new THREE.SphereGeometry(0.48, 18, 18), dogMat);
    dBody.scale.set(1.3, 0.9, 0.85);
    dog.add(dBody);
    const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 18), dogMat);
    dHead.position.set(0.55, 0.3, 0);
    dog.add(dHead);
    this.add3DEyes(dog, 0.82, 0.36, 0.16, 0.06);

    const tick = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e })
    );
    tick.position.set(-0.05, 0.48, 0);
    dog.add(tick);
    this.dioramaGroup.add(dog);

    this.actors.trioGroups = [buffalo, tree, dog];

    this.addPin("[+ / +] Mynah & Buffalo", "Mutualism", "#10b981", new THREE.Vector3(-1.75, 0.85, 0));
    this.addPin("[+ / 0] Orchid & Tree", "Commensalism", "#38bdf8", new THREE.Vector3(0, 0.95, 0));
    this.addPin("[+ / -] Tick & Dog", "Parasitism", "#f43f5e", new THREE.Vector3(1.75, 0.85, 0));
  }

  // ==========================================================================
  // STAGE 8: 3D ISO GREENHOUSE — CROWDED VS. SPACED SAPLINGS (- / -)
  // ==========================================================================
  buildStage8_SaplingCompetition() {
    this.createIsoBlock({ topColor: 0x334155, midColor: 0x1e293b });

    // Glowing 3D Sun Overhead
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    sun.position.set(0, 2.35, -0.8);
    this.dioramaGroup.add(sun);

    const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.55 });
    [-1.4, 1.4].forEach((x) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.82, 0.95, 24), potMat);
      pot.position.set(x, -0.65, 0);
      pot.castShadow = true;
      this.dioramaGroup.add(pot);
    });

    // Left Pot: Crowded Stunted Saplings
    const crowdedList = [];
    const paleMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.45 });
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const r = (i % 3) * 0.25 + 0.1;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.85, 8), paleMat);
      stem.position.set(-1.4 + Math.cos(ang) * r, 0.1, Math.sin(ang) * r);
      this.dioramaGroup.add(stem);
      crowdedList.push(stem);
    }
    this.actors.crowdedList = crowdedList;

    // Right Pot: 3 Spaced Lush Emerald Trees
    const lushMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    [-0.42, 0, 0.42].forEach((dx, idx) => {
      const dz = idx === 1 ? -0.3 : 0.22;
      const tree = new THREE.Group();
      tree.position.set(1.4 + dx, -0.2, dz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 1.5, 12), lushMat);
      trunk.position.y = 0.75;
      tree.add(trunk);

      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), lushMat);
      crown.position.y = 1.55;
      tree.add(crown);

      this.dioramaGroup.add(tree);
    });

    this.addPin("Pot A (Crowded)", "- Stunted (Resource Competition)", "#f59e0b", new THREE.Vector3(-1.4, 0.95, 0));
    this.addPin("Pot B (3 Spaced)", "+ Optimal Light, Water & Space", "#10b981", new THREE.Vector3(1.4, 1.7, 0));
  }

  // ==========================================================================
  // STAGE 9: 3D ISO PLANTATION — SCULPTED 3D BARN OWL & 3D RATS
  // ==========================================================================
  buildStage9_BarnOwlRatEstate() {
    this.createIsoBlock({ topColor: 0x15803d, midColor: 0x78350f });

    // 2 Isometric Oil Palm Trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
    [-1.7, 1.7].forEach((x) => {
      const palm = new THREE.Group();
      palm.position.set(x, -1.1, -0.8);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 2.2, 16), trunkMat);
      t.position.y = 1.1;
      palm.add(t);
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.88, 1), leafMat);
      crown.scale.set(1.3, 0.5, 1.3);
      crown.position.y = 2.25;
      palm.add(crown);
      this.dioramaGroup.add(palm);
    });

    // 3D Scurrying Plantation Rat on Ground
    const rat = new THREE.Group();
    const ratMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const rBody = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), ratMat);
    rBody.scale.set(1.6, 0.85, 0.85);
    rat.add(rBody);
    this.add3DEyes(rat, 0.32, 0.08, 0.11, 0.045);
    rat.position.set(0, -0.85, 0.85);
    this.dioramaGroup.add(rat);
    this.actors.rat = rat;

    // Sculpted 3D Barn Owl with Eyes, Beak & Articulated Flapping Wings
    const owl = new THREE.Group();
    const owlBodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), owlBodyMat);
    body.scale.set(1.35, 0.95, 0.9);
    owl.add(body);

    this.add3DEyes(owl, 0.46, 0.12, 0.16, 0.075);

    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.07, 1.15), wingMat);
    leftWing.position.z = 0.65;
    owl.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.07, 1.15), wingMat);
    rightWing.position.z = -0.65;
    owl.add(rightWing);

    owl.userData = { leftWing, rightWing };
    owl.position.set(0, 1.15, 0.3);
    this.dioramaGroup.add(owl);
    this.actors.owl = owl;

    this.addPin("3D Barn Owl (Predator)", "+ Natural Bio-Control", "#38bdf8", new THREE.Vector3(0, 1.85, 0.3));
    this.addPin("3D Rat Pest (Prey)", "Population Drops ↓", "#f43f5e", new THREE.Vector3(0, -0.35, 0.85));
  }

  // ==========================================================================
  // STAGE 10: 3D ISO MASTER BIOME ISLAND (WHALE + MANGO TREE + CLOWNFISH)
  // ==========================================================================
  buildStage10_IsoMasterIsland() {
    this.createIsoBlock({
      topColor: 0x10b981,
      midColor: 0x0f172a,
      waterColor: 0x0284c7,
      waterHeight: 2.6
    });

    // Sculpted 3D Blue Whale with White Barnacles [+ / 0]
    const whale = new THREE.Group();
    const whaleMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 });
    const wBody = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 24), whaleMat);
    wBody.scale.set(2.1, 0.85, 0.95);
    whale.add(wBody);

    this.add3DEyes(whale, 1.1, 0.05, 0.45, 0.09);

    // White Barnacles on Whale back
    const barnMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    [-0.2, 0.2, 0.55].forEach((bx, idx) => {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.12, 10), barnMat);
      b.position.set(bx, 0.62, (idx - 1) * 0.18);
      whale.add(b);
    });

    whale.position.set(-0.5, 0.35, -0.3);
    this.dioramaGroup.add(whale);
    this.actors.whale = whale;

    // Companion 3D Clownfish
    const fish = this.createClownfish3D(0.75);
    fish.position.set(1.25, 0.25, 0.85);
    this.dioramaGroup.add(fish);
    this.actors.clownfish = fish;

    this.addPin("Whale & Barnacles", "Commensalism [+ / 0]", "#38bdf8", new THREE.Vector3(-0.4, 1.35, -0.3));
    this.addPin("Unit 4 Mastery", "All 3D Interactions Verified", "#10b981", new THREE.Vector3(1.25, 1.0, 0.85));
  }

  // ==========================================================================
  // 60FPS ANIMATION LOOP & LIVE SLIDER PHYSICS
  // ==========================================================================
  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera) return;

    const t = this.clock.getElapsedTime();
    this.simValue += (this.targetSimValue - this.simValue) * 0.1;
    const s = this.simValue / 100;

    // Gentle three-quarter isometric sway around 0.38 rad (~22° yaw) so side profiles + cube faces stay clear
    if (this.camState.autoOrbit && !this.camState.isDragging) {
      this.camState.targetTheta = 0.38 + Math.sin(t * 0.45) * 0.16;
    }
    this.camState.theta += (this.camState.targetTheta - this.camState.theta) * 0.08;
    this.camState.phi += (this.camState.targetPhi - this.camState.phi) * 0.08;
    this.camState.radius += (this.camState.targetRadius - this.camState.radius) * 0.08;

    const cx =
      this.camState.radius * Math.sin(this.camState.phi) * Math.sin(this.camState.theta);
    const cy = this.camState.radius * Math.cos(this.camState.phi);
    const cz =
      this.camState.radius * Math.sin(this.camState.phi) * Math.cos(this.camState.theta);

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(0, -0.05, 0);

    if (this.particleSystem) {
      this.particleSystem.rotation.y = t * 0.03;
    }

    // Stage-specific 3D Iso animations
    if (this.currentStage === 1) {
      if (this.actors.tentacles) {
        this.actors.tentacles.forEach((tp) => {
          tp.rotation.z = Math.sin(t * 2.4 + tp.userData.phase) * 0.18;
          tp.rotation.x = Math.cos(t * 1.9 + tp.userData.phase) * 0.14;
        });
      }
      if (this.actors.clownfish) {
        const cf = this.actors.clownfish;
        cf.position.x = -1.65 + s * 2.35;
        cf.position.y = 0.65 + Math.sin(t * 3.2) * 0.1;
        if (cf.userData.tail) cf.userData.tail.rotation.y = Math.sin(t * 10) * 0.35;
        if (cf.userData.shield) {
          cf.userData.shield.material.opacity = Math.max(0, (s - 0.5) * 0.55);
          cf.userData.shield.rotation.y = t;
        }
        if (this.pins[0]) this.pins[0].pos.x = cf.position.x;
      }
    } else if (this.currentStage === 2) {
      if (this.actors.shark) {
        this.actors.shark.position.y = 0.68 + Math.sin(t * 2.2) * 0.09;
        if (this.actors.shark.userData.tail) {
          this.actors.shark.userData.tail.rotation.y = Math.sin(t * 6.5) * 0.28;
        }
      }
      if (this.actors.remora) {
        this.actors.remora.position.y = -0.85 + s * 0.92 + Math.sin(t * 2.2) * 0.09;
        if (this.pins[1]) this.pins[1].pos.y = this.actors.remora.position.y - 0.32;
      }
    } else if (this.currentStage === 3) {
      if (this.actors.palmTrunk && this.actors.xrayRing) {
        this.actors.palmTrunk.material.opacity = 1.0 - s * 0.72;
        this.actors.xrayRing.position.y = -0.8 + s * 2.4;
      }
    } else if (this.currentStage === 4) {
      if (this.actors.rafflesia) {
        const sc = 0.5 + s * 0.58;
        this.actors.rafflesia.scale.set(sc, sc, sc);
      }
    } else if (this.currentStage === 5) {
      if (this.actors.wormSegments) {
        this.actors.wormSegments.forEach((seg, idx) => {
          seg.position.y = 0.65 + Math.sin(t * 4.5 + idx * 0.45) * (0.1 + s * 0.18);
        });
      }
    } else if (this.currentStage === 6) {
      if (this.actors.crabGroup && this.actors.octo) {
        this.actors.crabGroup.position.x = -1.35 + s * 1.25;
        this.actors.octo.position.x = 0.95 + s * 1.15;
        this.actors.octo.position.y = 0.55 + Math.sin(t * 3) * 0.16;
      }
    } else if (this.currentStage === 7) {
      if (this.actors.trioGroups) {
        const activeIdx = s < 0.34 ? 0 : s < 0.67 ? 1 : 2;
        this.actors.trioGroups.forEach((grp, idx) => {
          const targetY = idx === activeIdx ? -0.15 : -0.55;
          grp.position.y += (targetY - grp.position.y) * 0.12;
          grp.rotation.y = Math.sin(t * 1.5 + idx) * 0.25;
        });
      }
    } else if (this.currentStage === 8) {
      if (this.actors.crowdedList) {
        this.actors.crowdedList.forEach((stem, idx) => {
          stem.visible = idx < Math.max(3, Math.round(3 + s * 13));
          stem.scale.y = 1.2 - s * 0.5;
        });
      }
    } else if (this.currentStage === 9) {
      if (this.actors.owl) {
        const owl = this.actors.owl;
        owl.position.x = Math.cos(t * (1.2 + s * 1.4)) * 1.45;
        owl.position.z = Math.sin(t * (1.2 + s * 1.4)) * 1.05;
        owl.rotation.y = -t * (1.2 + s * 1.4);
        const flap = Math.sin(t * 14) * 0.45;
        owl.userData.leftWing.rotation.x = flap;
        owl.userData.rightWing.rotation.x = -flap;
        if (this.pins[0]) {
          this.pins[0].pos.x = owl.position.x;
          this.pins[0].pos.z = owl.position.z;
        }
      }
      if (this.actors.rat) {
        this.actors.rat.scale.setScalar(Math.max(0.25, 1.1 - s * 0.75));
      }
    } else if (this.currentStage === 10) {
      if (this.actors.whale) {
        this.actors.whale.position.y = 0.35 + Math.sin(t * 2) * 0.1;
      }
      if (this.actors.clownfish) {
        this.actors.clownfish.position.y = 0.25 + Math.cos(t * 3) * 0.1;
        if (this.actors.clownfish.userData.tail) {
          this.actors.clownfish.userData.tail.rotation.y = Math.sin(t * 10) * 0.35;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.updateProjectedPins();
  }
}

window.EcoSimEngine = EcoSimEngine;
