// ============================================================================
// ECOQUEST 3D — INTERACTIVE SPATIAL WEBGL DIORAMA ENGINE (Three.js)
// Full-Screen 360° Orbit Camera, Projected 3D Pins & Slider-Driven 3D Models
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
    this.isQuizLayout = false;

    // 360° Orbit Camera spherical state
    this.camState = {
      theta: 0.35,
      phi: 1.15,
      radius: 10.5,
      targetTheta: 0.35,
      targetPhi: 1.15,
      targetRadius: 10.5,
      autoOrbit: true,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      lookAtX: 0,
      targetLookAtX: 0
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
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.032);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 120);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // Master Diorama Group
    this.dioramaGroup = new THREE.Group();
    this.scene.add(this.dioramaGroup);

    window.addEventListener("resize", () => this.resize());
  }

  initLights() {
    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.85);
    this.scene.add(hemi);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.keyLight.position.set(7, 13, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.PointLight(0x38bdf8, 1.8, 26);
    this.rimLight.position.set(-7, 5, -6);
    this.scene.add(this.rimLight);

    this.accentLight = new THREE.PointLight(0x10b981, 1.4, 22);
    this.accentLight.position.set(5, -3, 5);
    this.scene.add(this.accentLight);
  }

  initAmbientParticles() {
    const count = 140;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.11,
      transparent: true,
      opacity: 0.65
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
        0.45,
        Math.min(1.48, this.camState.targetPhi - dy * 0.006)
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
          6.5,
          Math.min(15.5, this.camState.targetRadius + e.deltaY * 0.005)
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
    // Shift camera target right so the 3D diorama sits cleanly on the left 58% of desktop screen
    if (this.isQuizLayout && window.innerWidth > 960) {
      this.camState.targetLookAtX = 2.15;
    } else {
      this.camState.targetLookAtX = 0;
    }
  }

  setCameraPreset(preset) {
    if (preset === "front") {
      this.camState.targetTheta = 0.25;
      this.camState.targetPhi = 1.15;
      this.camState.targetRadius = 10.2;
    } else if (preset === "top") {
      this.camState.targetTheta = 0.0;
      this.camState.targetPhi = 0.55;
      this.camState.targetRadius = 11.5;
    } else if (preset === "closeup") {
      this.camState.targetPhi = 1.2;
      this.camState.targetRadius = 7.4;
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
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.updateCenterOffset();
  }

  setSimValue(val) {
    this.targetSimValue = Math.max(0, Math.min(100, Number(val)));
  }

  triggerFeedbackPulse() {
    // Quick celebratory camera zoom bounce
    const prev = this.camState.targetRadius;
    this.camState.targetRadius = Math.max(7.2, prev - 1.2);
    setTimeout(() => {
      this.camState.targetRadius = prev;
    }, 450);
  }

  clearDiorama() {
    while (this.dioramaGroup.children.length > 0) {
      const child = this.dioramaGroup.children[0];
      this.dioramaGroup.remove(child);
    }
    this.actors = {};
    this.pins = [];
  }

  // Create stylized floating 3D island pedestal
  createIslandBase(topColor = 0x1e293b, rimColor = 0x10b981) {
    const baseGroup = new THREE.Group();

    // Main cylindrical platform
    const platGeo = new THREE.CylinderGeometry(3.8, 3.3, 0.55, 36);
    const platMat = new THREE.MeshStandardMaterial({
      color: topColor,
      roughness: 0.45,
      metalness: 0.15
    });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.y = -1.75;
    plat.receiveShadow = true;
    baseGroup.add(plat);

    // Glowing holographic outer ring
    const ringGeo = new THREE.TorusGeometry(3.92, 0.045, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: rimColor });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.5;
    baseGroup.add(ring);

    // Lower tapered dark base
    const underGeo = new THREE.ConeGeometry(3.2, 1.3, 8);
    const underMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      flatShading: true
    });
    const under = new THREE.Mesh(underGeo, underMat);
    under.rotation.x = Math.PI;
    under.position.y = -2.65;
    baseGroup.add(under);

    this.dioramaGroup.add(baseGroup);
    return baseGroup;
  }

  // Register a 3D world-space callout pin that projects onto the HTML overlay
  addPin(name, effect, color, worldPosVec3) {
    this.pins.push({
      name,
      effect,
      color,
      pos: worldPosVec3,
      el: null
    });
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
      div.onclick = () => {
        this.setCameraPreset("closeup");
      };
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
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-(v.y * 0.5) + 0.5) * h;
      p.el.style.display = "flex";
      p.el.style.left = `${x}px`;
      p.el.style.top = `${y}px`;
    });
  }

  // ==========================================================================
  // BUILD 3D DIORAMA FOR EACH OF THE 10 STAGES
  // ==========================================================================
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
      case 5: this.buildStage5_Tapeworm(); break;
      case 6: this.buildStage6_HermitCrab(); break;
      case 7: this.buildStage7_SymbiosisCrystals(); break;
      case 8: this.buildStage8_SaplingCompetition(); break;
      case 9: this.buildStage9_BarnOwlBioControl(); break;
      default: this.buildStage10_SynthesisCore(); break;
    }

    this.rebuildPinDOM();
  }

  // Helper: Create 3D Fish Mesh
  createClownfish3D() {
    const fish = new THREE.Group();
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), orangeMat);
    body.scale.set(1.55, 0.88, 0.65);
    body.castShadow = true;
    fish.add(body);

    // 2 White Collar Stripes
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.14, 20), whiteMat);
    s1.rotation.z = Math.PI / 2;
    s1.scale.set(0.88, 1, 0.68);
    s1.position.x = 0.18;
    fish.add(s1);

    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.14, 20), whiteMat);
    s2.rotation.z = Math.PI / 2;
    s2.scale.set(0.88, 1, 0.68);
    s2.position.x = -0.22;
    fish.add(s2);

    // Tail fin
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.5, 4), orangeMat);
    tail.rotation.z = -Math.PI / 2;
    tail.scale.set(1, 1, 0.3);
    tail.position.x = -0.78;
    fish.add(tail);
    fish.userData.tail = tail;

    // Eyes
    [-0.22, 0.22].forEach((z) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), darkMat);
      eye.position.set(0.46, 0.1, z);
      fish.add(eye);
    });

    // Protective Mucus Aura Sphere
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    });
    const shield = new THREE.Mesh(new THREE.SphereGeometry(0.95, 16, 16), shieldMat);
    fish.add(shield);
    fish.userData.shield = shield;

    return fish;
  }

  // STAGE 1: 3D Coral Reef — Clownfish & Sea Anemone
  buildStage1_ReefMutualism() {
    this.createIslandBase(0x0c4a6e, 0x10b981);

    // Coral Reef Rock Mound
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
      flatShading: true
    });
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), rockMat);
    rock.scale.set(1.2, 0.65, 1.1);
    rock.position.set(0.8, -1.1, 0);
    this.dioramaGroup.add(rock);

    // Sea Anemone Base Column
    const anemGroup = new THREE.Group();
    anemGroup.position.set(0.8, -0.5, 0);
    const colMat = new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.5 });
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.1, 0.75, 24), colMat);
    anemGroup.add(col);

    // 24 3D Swaying Tentacles with glowing tips
    const tentacles = [];
    const tentMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 });
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const ringRadius = i % 2 === 0 ? 0.68 : 0.36;
      const tPivot = new THREE.Group();
      tPivot.position.set(Math.cos(angle) * ringRadius, 0.32, Math.sin(angle) * ringRadius);

      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.25, 12), tentMat);
      stalk.position.y = 0.62;
      tPivot.add(stalk);

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), tipMat);
      tip.position.y = 1.26;
      tPivot.add(tip);

      tPivot.userData = { baseAngle: angle, phase: i * 0.5 };
      anemGroup.add(tPivot);
      tentacles.push(tPivot);
    }
    this.dioramaGroup.add(anemGroup);
    this.actors.tentacles = tentacles;

    // 3D Clownfish
    const fish = this.createClownfish3D();
    fish.position.set(0.6, 0.65, 0.2);
    this.dioramaGroup.add(fish);
    this.actors.clownfish = fish;

    this.addPin("Clownfish", "+ Protected Shelter", "#10b981", new THREE.Vector3(0.6, 1.45, 0.2));
    this.addPin("Sea Anemone", "+ Cleaned & Defended", "#38bdf8", new THREE.Vector3(1.2, 0.1, -0.6));
  }

  // STAGE 2: 3D Shark & Hitchhiking Remora Fish
  buildStage2_SharkRemora() {
    this.createIslandBase(0x0f172a, 0x38bdf8);

    const shark = new THREE.Group();
    const sharkMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.35, metalness: 0.2 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });

    // Streamlined fuselage
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.85, 28, 28), sharkMat);
    torso.scale.set(2.9, 0.72, 0.82);
    torso.castShadow = true;
    shark.add(torso);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.8, 24, 24), bellyMat);
    belly.scale.set(2.6, 0.5, 0.76);
    belly.position.y = -0.18;
    shark.add(belly);

    // Dorsal Fin
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.15, 4), sharkMat);
    dorsal.scale.set(1.2, 1, 0.25);
    dorsal.position.set(-0.1, 0.85, 0);
    dorsal.rotation.z = -0.25;
    shark.add(dorsal);

    // Pectoral Fins
    [-0.85, 0.85].forEach((z) => {
      const pec = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.1, 4), sharkMat);
      pec.position.set(0.3, -0.25, z);
      pec.rotation.x = z > 0 ? 1.25 : -1.25;
      shark.add(pec);
    });

    // Tail Fin
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.2, 4), sharkMat);
    tail.position.set(-2.55, 0.15, 0);
    tail.rotation.z = -Math.PI / 2;
    tail.scale.set(1, 1, 0.25);
    shark.add(tail);
    shark.userData.tail = tail;

    shark.position.set(0, 0.7, 0);
    this.dioramaGroup.add(shark);
    this.actors.shark = shark;

    // 3D Remora with Suction Pad
    const remora = new THREE.Group();
    const remMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const remBody = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), remMat);
    remBody.scale.set(2.4, 0.5, 0.6);
    remora.add(remBody);

    const padMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.24), padMat);
    pad.position.y = 0.16;
    remora.add(pad);

    remora.position.set(0.2, 0.05, 0);
    this.dioramaGroup.add(remora);
    this.actors.remora = remora;

    this.addPin("Shark Host", "0 Unaffected (Neutral)", "#94a3b8", new THREE.Vector3(0.2, 1.85, 0));
    this.addPin("Remora Fish", "+ Free Transport & Scraps", "#38bdf8", new THREE.Vector3(0.3, -0.35, 0.4));
  }

  // STAGE 3: 3D Oil Palm Trunk & Bird's Nest Fern with 3D X-Ray Ring
  buildStage3_FernPalmXRay() {
    this.createIslandBase(0x14532d, 0x10b981);

    // Oil Palm Trunk
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.85,
      transparent: true,
      opacity: 0.9
    });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 4.4, 24), trunkMat);
    trunk.position.y = 0.6;
    this.dioramaGroup.add(trunk);
    this.actors.palmTrunk = trunk;

    // Internal Glowing Blue Vascular Sap Tubes (Visible when X-Ray slider increases)
    const sapGroup = new THREE.Group();
    const sapMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-0.32, 0, 0.32].forEach((x) => {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.2, 12), sapMat);
      tube.position.set(x, 0.6, 0);
      sapGroup.add(tube);
    });
    this.dioramaGroup.add(sapGroup);
    this.actors.sapGroup = sapGroup;

    // 3D Holographic X-Ray Scanner Ring around trunk
    const xrayRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.18, 0.05, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    xrayRing.rotation.x = Math.PI / 2;
    xrayRing.position.y = 0.6;
    this.dioramaGroup.add(xrayRing);
    this.actors.xrayRing = xrayRing;

    // Bird's Nest Fern perched on outer right bark
    const fern = new THREE.Group();
    fern.position.set(0.88, 0.55, 0);

    const rootBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    fern.add(rootBall);

    const frondMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    for (let i = 0; i < 9; i++) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.06, 0.28), frondMat);
      const angle = (i / 9) * Math.PI - Math.PI / 2;
      f.position.set(0.55, 0.25 + Math.sin(i) * 0.15, Math.sin(angle) * 0.55);
      f.rotation.z = 0.45 + (i % 3) * 0.15;
      f.rotation.y = angle * 0.5;
      fern.add(f);
    }
    this.dioramaGroup.add(fern);
    this.actors.fern = fern;

    this.addPin("Bird's Nest Fern", "+ Sunlit Epiphyte", "#10b981", new THREE.Vector3(1.65, 1.35, 0));
    this.addPin("Oil Palm Trunk", "0 Outer Bark Unharmed", "#38bdf8", new THREE.Vector3(-0.7, 0.8, 0));
  }

  // STAGE 4: 3D Giant Rafflesia & Tetrastigma Vine
  buildStage4_Rafflesia() {
    this.createIslandBase(0x1f2937, 0xf43f5e);

    // Host Tetrastigma Vine
    const vineMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.7 });
    const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 5.5, 20), vineMat);
    vine.rotation.z = Math.PI / 2;
    vine.position.y = -1.1;
    this.dioramaGroup.add(vine);
    this.actors.vine = vine;

    // 3D Giant 5-Petalled Rafflesia Flower
    const rafflesia = new THREE.Group();
    rafflesia.position.set(0, -0.55, 0);

    const petalMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.45 });
    const wartMat = new THREE.MeshStandardMaterial({ color: 0xffe4e6 });

    for (let i = 0; i < 5; i++) {
      const pGroup = new THREE.Group();
      pGroup.rotation.y = (i * Math.PI * 2) / 5;

      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), petalMat);
      petal.scale.set(0.95, 0.22, 1.25);
      petal.position.set(0, 0.15, 1.15);
      petal.rotation.x = -0.22;
      pGroup.add(petal);

      // Raised white warts on 3D petals
      [-0.25, 0.22].forEach((wx) => {
        const wart = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), wartMat);
        wart.position.set(wx, 0.34, 1.15 + wx * 0.4);
        pGroup.add(wart);
      });

      rafflesia.add(pGroup);
    }

    // Central Corona Bowl
    const corona = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.24, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 })
    );
    corona.rotation.x = Math.PI / 2;
    corona.position.y = 0.25;
    rafflesia.add(corona);

    this.dioramaGroup.add(rafflesia);
    this.actors.rafflesia = rafflesia;

    this.addPin("Rafflesia (Parasite)", "+ Drains Host Sap", "#f43f5e", new THREE.Vector3(0, 0.85, 0));
    this.addPin("Tetrastigma Vine", "- Weakened Host", "#f59e0b", new THREE.Vector3(-2.1, -0.7, 0));
  }

  // STAGE 5: 3D Intestinal Cutaway & Undulating Tapeworm
  buildStage5_Tapeworm() {
    this.createIslandBase(0x31102f, 0xf43f5e);

    // 3D Cutaway Half-Cylinder of Small Intestine
    const wallGeo = new THREE.CylinderGeometry(1.65, 1.65, 5.4, 24, 1, true, 0, Math.PI);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x9d174d,
      roughness: 0.6,
      side: THREE.DoubleSide
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.rotation.z = Math.PI / 2;
    wall.rotation.x = Math.PI;
    wall.position.y = 0.2;
    this.dioramaGroup.add(wall);

    // 22-Segment Undulating 3D Tapeworm
    const wormSegments = [];
    const segMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.35 });
    for (let i = 0; i < 22; i++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.36, 0.14), segMat);
      seg.position.set(-2.1 + i * 0.2, 0.2, 0);
      this.dioramaGroup.add(seg);
      wormSegments.push(seg);
    }
    this.actors.wormSegments = wormSegments;

    this.addPin("Tapeworm", "+ Parasite (Steals Nutrients)", "#10b981", new THREE.Vector3(0.3, 1.1, 0));
    this.addPin("Host Intestine", "- Malnourished Host", "#f43f5e", new THREE.Vector3(-1.6, -0.4, 0.8));
  }

  // STAGE 6: 3D Hermit Crab + Sea Anemone vs. Predator
  buildStage6_HermitCrab() {
    this.createIslandBase(0x78350f, 0x10b981);

    const crabGroup = new THREE.Group();
    crabGroup.position.set(-0.6, -0.95, 0);

    // Spiral Snail Shell
    const shell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.95, 1),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
    );
    shell.scale.set(1.2, 0.95, 1.0);
    crabGroup.add(shell);

    // Red Crab Claws & Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    [-0.55, 0.55].forEach((z) => {
      const claw = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), legMat);
      claw.scale.set(1.5, 0.7, 0.7);
      claw.position.set(0.95, -0.25, z);
      crabGroup.add(claw);
    });

    // Sea Anemone riding on top of shell
    const anem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.52, 0.55, 18),
      new THREE.MeshStandardMaterial({ color: 0xdb2777 })
    );
    anem.position.y = 0.95;
    crabGroup.add(anem);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const t = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 0.65, 8),
        new THREE.MeshBasicMaterial({ color: 0xf472b6 })
      );
      t.position.set(Math.cos(ang) * 0.32, 1.4, Math.sin(ang) * 0.32);
      crabGroup.add(t);
    }

    this.dioramaGroup.add(crabGroup);
    this.actors.crabGroup = crabGroup;

    // 3D Octopus Predator
    const octo = new THREE.Mesh(
      new THREE.SphereGeometry(0.68, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35 })
    );
    octo.position.set(2.2, 0.6, 0);
    this.dioramaGroup.add(octo);
    this.actors.octo = octo;

    this.addPin("Sea Anemone", "+ Stinging Shield & Mobility", "#10b981", new THREE.Vector3(-0.4, 1.2, 0));
    this.addPin("Hermit Crab", "+ Protected Carrier", "#38bdf8", new THREE.Vector3(-0.4, -0.4, 0.7));
  }

  // STAGE 7: 3D Symbiosis Crystal Monuments ([+ / +], [+ / 0], [+ / -])
  buildStage7_SymbiosisCrystals() {
    this.createIslandBase(0x1e293b, 0x6366f1);

    const configs = [
      { x: -2.1, col: 0x10b981, name: "Mutualism [+ / +]", sub: "Mynah & Buffalo" },
      { x: 0.0, col: 0x38bdf8, name: "Commensalism [+ / 0]", sub: "Orchid & Tree" },
      { x: 2.1, col: 0xf43f5e, name: "Parasitism [+ / -]", sub: "Tick & Dog" }
    ];

    this.actors.crystals = [];
    configs.forEach((c) => {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.78, 0),
        new THREE.MeshStandardMaterial({
          color: c.col,
          roughness: 0.15,
          metalness: 0.5,
          emissive: c.col,
          emissiveIntensity: 0.25
        })
      );
      crystal.position.set(c.x, 0.35, 0);
      this.dioramaGroup.add(crystal);
      this.actors.crystals.push(crystal);

      this.addPin(c.name, c.sub, `#${c.col.toString(16).padStart(6, "0")}`, new THREE.Vector3(c.x, 1.4, 0));
    });
  }

  // STAGE 8: 3D Greenhouse Pots — Crowded vs. Spaced Saplings
  buildStage8_SaplingCompetition() {
    this.createIslandBase(0x1e293b, 0xf59e0b);

    const potMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
    [-1.55, 1.55].forEach((x) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.88, 1.1, 24), potMat);
      pot.position.set(x, -0.95, 0);
      this.dioramaGroup.add(pot);
    });

    // Left Pot: Crowded Stunted Saplings
    const crowdedList = [];
    const paleMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const r = (i % 3) * 0.28 + 0.12;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.9, 8), paleMat);
      stem.position.set(-1.55 + Math.cos(ang) * r, -0.1, Math.sin(ang) * r);
      this.dioramaGroup.add(stem);
      crowdedList.push(stem);
    }
    this.actors.crowdedList = crowdedList;

    // Right Pot: 3 Spaced Lush Emerald Saplings
    const lushMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 });
    [-0.45, 0, 0.45].forEach((dx, idx) => {
      const dz = idx === 1 ? -0.35 : 0.25;
      const tree = new THREE.Group();
      tree.position.set(1.55 + dx, -0.35, dz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.75, 12), lushMat);
      trunk.position.y = 0.85;
      tree.add(trunk);

      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), lushMat);
      crown.position.y = 1.75;
      tree.add(crown);

      this.dioramaGroup.add(tree);
    });

    this.addPin("Pot A (Crowded)", "- High Competition (Stunted)", "#f59e0b", new THREE.Vector3(-1.55, 0.95, 0));
    this.addPin("Pot B (3 Spaced)", "+ Optimal Sunlight, Water & Space", "#10b981", new THREE.Vector3(1.55, 1.75, 0));
  }

  // STAGE 9: 3D Oil Palm Estate & Swooping 3D Barn Owl (Biological Control)
  buildStage9_BarnOwlBioControl() {
    this.createIslandBase(0x14532d, 0x38bdf8);

    // 2 Oil Palm Trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
    [-1.8, 1.8].forEach((x) => {
      const palm = new THREE.Group();
      palm.position.set(x, -1.4, -0.6);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 2.5, 16), trunkMat);
      t.position.y = 1.25;
      palm.add(t);
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 1), leafMat);
      crown.scale.set(1.3, 0.55, 1.3);
      crown.position.y = 2.55;
      palm.add(crown);
      this.dioramaGroup.add(palm);
    });

    // 3D Articulated Swooping Barn Owl
    const owl = new THREE.Group();
    const owlMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), owlMat);
    body.scale.set(1.3, 0.9, 0.85);
    owl.add(body);

    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 1.1), wingMat);
    leftWing.position.z = 0.65;
    owl.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 1.1), wingMat);
    rightWing.position.z = -0.65;
    owl.add(rightWing);

    owl.userData = { leftWing, rightWing };
    owl.position.set(0, 1.1, 0.4);
    this.dioramaGroup.add(owl);
    this.actors.owl = owl;

    this.addPin("Barn Owl (Predator)", "+ Natural Bio-Control", "#38bdf8", new THREE.Vector3(0, 1.85, 0.4));
    this.addPin("Oil Palm Estate", "+ Fruit Yield Increases ↑", "#10b981", new THREE.Vector3(1.8, 1.65, -0.6));
  }

  // STAGE 10: 3D Ecosystem Synthesis Gyroscope Core
  buildStage10_SynthesisCore() {
    this.createIslandBase(0x0f172a, 0xf59e0b);

    const core = new THREE.Group();
    core.position.y = 0.35;

    const sun = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 1),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        wireframe: false,
        flatShading: true
      })
    );
    core.add(sun);

    const rings = [];
    [1.55, 2.15, 2.75].forEach((r, i) => {
      const cols = [0x10b981, 0x38bdf8, 0xf43f5e];
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.04, 16, 64),
        new THREE.MeshBasicMaterial({ color: cols[i] })
      );
      ring.rotation.x = 0.6 + i * 0.45;
      core.add(ring);
      rings.push(ring);
    });

    this.dioramaGroup.add(core);
    this.actors.gyroRings = rings;
    this.actors.gyroSun = sun;

    this.addPin("Unit 4 Mastery Core", "Symbiosis · Predation · Competition", "#10b981", new THREE.Vector3(0, 1.85, 0));
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

    // Smoothly orbit camera
    if (this.camState.autoOrbit && !this.camState.isDragging) {
      this.camState.targetTheta += 0.0022;
    }
    this.camState.theta += (this.camState.targetTheta - this.camState.theta) * 0.08;
    this.camState.phi += (this.camState.targetPhi - this.camState.phi) * 0.08;
    this.camState.radius += (this.camState.targetRadius - this.camState.radius) * 0.08;
    this.camState.lookAtX += (this.camState.targetLookAtX - this.camState.lookAtX) * 0.08;

    const cx =
      this.camState.lookAtX +
      this.camState.radius * Math.sin(this.camState.phi) * Math.sin(this.camState.theta);
    const cy = this.camState.radius * Math.cos(this.camState.phi);
    const cz =
      this.camState.radius * Math.sin(this.camState.phi) * Math.cos(this.camState.theta);

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this.camState.lookAtX, 0.1, 0);

    // Ambient particle drift
    if (this.particleSystem) {
      this.particleSystem.rotation.y = t * 0.04;
    }

    // Stage-specific 3D animations driven by time `t` and slider `s`
    if (this.currentStage === 1) {
      if (this.actors.tentacles) {
        this.actors.tentacles.forEach((tp) => {
          tp.rotation.z = Math.sin(t * 2.2 + tp.userData.phase) * 0.18;
          tp.rotation.x = Math.cos(t * 1.8 + tp.userData.phase) * 0.14;
        });
      }
      if (this.actors.clownfish) {
        const cf = this.actors.clownfish;
        // Slider moves clownfish from open water (-2.1) into anemone (+0.75)
        cf.position.x = -2.1 + s * 2.85;
        cf.position.y = 0.65 + Math.sin(t * 3.2) * 0.12;
        if (cf.userData.tail) cf.userData.tail.rotation.y = Math.sin(t * 10) * 0.35;
        if (cf.userData.shield) {
          cf.userData.shield.material.opacity = Math.max(0, (s - 0.5) * 0.55);
          cf.userData.shield.rotation.y = t;
        }
        if (this.pins[0]) this.pins[0].pos.x = cf.position.x;
      }
    } else if (this.currentStage === 2) {
      if (this.actors.shark) {
        this.actors.shark.position.y = 0.7 + Math.sin(t * 2) * 0.1;
        if (this.actors.shark.userData.tail) {
          this.actors.shark.userData.tail.rotation.y = Math.sin(t * 6) * 0.28;
        }
      }
      if (this.actors.remora) {
        // Slider lifts 3D remora up to lock onto shark belly
        this.actors.remora.position.y = -1.15 + s * 1.22 + Math.sin(t * 2) * 0.1;
        if (this.pins[1]) this.pins[1].pos.y = this.actors.remora.position.y - 0.35;
      }
    } else if (this.currentStage === 3) {
      if (this.actors.palmTrunk && this.actors.xrayRing) {
        // Slider controls 3D X-Ray bark transparency and scanner ring height
        this.actors.palmTrunk.material.opacity = 1.0 - s * 0.72;
        this.actors.xrayRing.position.y = -1.1 + s * 3.1;
      }
    } else if (this.currentStage === 4) {
      if (this.actors.rafflesia) {
        const sc = 0.45 + s * 0.65;
        this.actors.rafflesia.scale.set(sc, sc, sc);
      }
    } else if (this.currentStage === 5) {
      if (this.actors.wormSegments) {
        this.actors.wormSegments.forEach((seg, idx) => {
          seg.position.y = 0.2 + Math.sin(t * 4.5 + idx * 0.45) * (0.12 + s * 0.22);
          seg.position.z = Math.cos(t * 3.5 + idx * 0.45) * 0.15;
        });
      }
    } else if (this.currentStage === 6) {
      if (this.actors.crabGroup && this.actors.octo) {
        this.actors.crabGroup.position.x = -1.6 + s * 1.65;
        this.actors.octo.position.x = 1.2 + s * 1.8;
        this.actors.octo.position.y = 0.6 + Math.sin(t * 3) * 0.2;
      }
    } else if (this.currentStage === 7) {
      if (this.actors.crystals) {
        this.actors.crystals.forEach((cr, i) => {
          cr.rotation.y = t * 1.2 + i;
          cr.position.y = 0.35 + Math.sin(t * 2.5 + i) * 0.18;
        });
      }
    } else if (this.currentStage === 8) {
      if (this.actors.crowdedList) {
        this.actors.crowdedList.forEach((stem, idx) => {
          stem.visible = idx < Math.max(3, Math.round(3 + s * 13));
          stem.scale.y = 1.25 - s * 0.55;
        });
      }
    } else if (this.currentStage === 9) {
      if (this.actors.owl) {
        const owl = this.actors.owl;
        owl.position.x = Math.cos(t * (1.2 + s * 1.5)) * 1.8;
        owl.position.z = Math.sin(t * (1.2 + s * 1.5)) * 1.2;
        owl.rotation.y = -t * (1.2 + s * 1.5);
        const flap = Math.sin(t * 14) * 0.45;
        owl.userData.leftWing.rotation.x = flap;
        owl.userData.rightWing.rotation.x = -flap;
        if (this.pins[0]) {
          this.pins[0].pos.x = owl.position.x;
          this.pins[0].pos.z = owl.position.z;
        }
      }
    } else if (this.currentStage === 10) {
      if (this.actors.gyroRings) {
        this.actors.gyroRings.forEach((r, i) => {
          r.rotation.y = t * (0.6 + i * 0.3);
          r.rotation.z = t * 0.4;
        });
      }
      if (this.actors.gyroSun) {
        this.actors.gyroSun.rotation.y = -t * 0.8;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.updateProjectedPins();
  }
}

window.EcoSimEngine = EcoSimEngine;
