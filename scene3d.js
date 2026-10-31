// ============================================================================
// ECOQUEST 3D WEBGL ENGINE (Three.js Interactive 3D Diorama & Creature Animator)
// Supports 360° Mouse/Touch Drag Rotation, Zoom, Click-to-Jump Raycasting,
// and 10 Custom Moving 3D Biological Scenes
// ============================================================================

class EcoWorld3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.currentSceneId = 1;
    this.animatedObjects = [];
    this.clickableMeshes = [];
    this.particles = null;
    this.rootGroup = null;

    // Interactive Orbit Controls state
    this.isDragging = false;
    this.prevX = 0;
    this.prevY = 0;
    this.targetRotY = 0.35;
    this.targetRotX = 0.15;
    this.currentRotY = 0.35;
    this.currentRotX = 0.15;
    this.cameraDistance = 11.5;
    this.celebrationTimer = 0;
    this.jumpBoost = 0;

    this.init();
  }

  init() {
    if (!this.canvas || typeof THREE === "undefined") return;

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    const w = this.canvas.parentElement.clientWidth || 600;
    const h = this.canvas.parentElement.clientHeight || 400;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 3.2, this.cameraDistance);
    this.camera.lookAt(0, 0.5, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffbeb, 1.15);
    this.dirLight.position.set(6, 12, 8);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 0.8, 25);
    rimLight.position.set(-6, 4, -5);
    this.scene.add(rimLight);

    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this.bindInteractionEvents();
    this.loadLevelScene(1);
    this.animate();

    window.addEventListener("resize", () => this.handleResize());
  }

  handleResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth || 600;
    const h = parent.clientHeight || 400;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  bindInteractionEvents() {
    // Mouse & Touch Drag to Spin 3D World
    this.canvas.addEventListener("pointerdown", (e) => {
      this.isDragging = true;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
      this.checkClickBounce(e);
    });

    window.addEventListener("pointermove", (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevX;
      const dy = e.clientY - this.prevY;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
      this.targetRotY += dx * 0.01;
      this.targetRotX = Math.max(-0.3, Math.min(0.65, this.targetRotX + dy * 0.006));
    });

    window.addEventListener("pointerup", () => {
      this.isDragging = false;
    });

    // Mouse wheel zoom
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(7.5, Math.min(16, this.cameraDistance + e.deltaY * 0.005));
    }, { passive: false });
  }

  checkClickBounce(e) {
    this.jumpBoost = 0.7;
    if (typeof soundFX !== "undefined") {
      soundFX.playTone(540, "sine", 0.07, 0, 0.08);
    }
  }

  triggerCelebration() {
    this.celebrationTimer = 2.0;
    this.jumpBoost = 1.1;
  }

  resetCameraView() {
    this.targetRotY = 0.35;
    this.targetRotX = 0.15;
    this.cameraDistance = 11.5;
  }

  clearScene() {
    if (!this.rootGroup) return;
    while (this.rootGroup.children.length > 0) {
      const child = this.rootGroup.children[0];
      this.rootGroup.remove(child);
    }
    this.animatedObjects = [];
  }

  // Helper material factory
  mat(color, roughness = 0.35, metalness = 0.15, emissive = 0x000000) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      emissive
    });
  }

  // Build Sleek Minimalist 3D Studio Turntable Pedestal
  buildIslandBase(topColor = 0x111c2d, rimColor = 0x10b981) {
    const baseGroup = new THREE.Group();
    const topCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(4.4, 4.4, 0.28, 48),
      this.mat(0x111a29, 0.4, 0.25)
    );
    topCyl.position.y = -1.55;
    topCyl.receiveShadow = true;
    baseGroup.add(topCyl);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.42, 0.04, 16, 64),
      this.mat(0x10b981, 0.2, 0.4, 0x059669)
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.42;
    baseGroup.add(ring);

    const subCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 3.4, 0.4, 48),
      this.mat(0x090e17, 0.6, 0.2)
    );
    subCyl.position.y = -1.9;
    baseGroup.add(subCyl);

    this.rootGroup.add(baseGroup);
  }

  // Build Floating Particle Bubbles / Fireflies
  buildParticles(color = 0x7dd3fc, count = 45) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = -1.2 + Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size: 0.2,
      transparent: true,
      opacity: 0.8
    });
    const pts = new THREE.Points(geo, mat);
    this.rootGroup.add(pts);
    this.animatedObjects.push((t) => {
      const arr = pts.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += 0.015;
        if (arr[i * 3 + 1] > 4.0) arr[i * 3 + 1] = -1.2;
      }
      pts.geometry.attributes.position.needsUpdate = true;
    });
  }

  // Helper: Create 3D Fish Mesh
  createFishMesh(bodyColor = 0xf97316, stripeColor = 0xffffff, scale = 1.0) {
    const fish = new THREE.Group();
    fish.scale.set(scale, scale, scale);

    // Body
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 20, 16),
      this.mat(bodyColor, 0.3)
    );
    body.scale.set(1.5, 0.95, 0.7);
    fish.add(body);

    // White Stripes for Clownfish
    if (stripeColor) {
      const s1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.64, 0.64, 0.22, 20),
        this.mat(stripeColor, 0.2)
      );
      s1.rotation.z = Math.PI / 2;
      s1.scale.set(0.96, 1, 0.72);
      s1.position.x = 0.2;
      fish.add(s1);

      const s2 = s1.clone();
      s2.position.x = -0.3;
      s2.scale.set(0.85, 1, 0.65);
      fish.add(s2);
    }

    // Tail fin
    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 0.75, 4),
      this.mat(bodyColor, 0.3)
    );
    tail.rotation.z = -Math.PI / 2;
    tail.scale.set(1, 1, 0.3);
    tail.position.x = -1.1;
    fish.add(tail);

    // Eyes
    const eyeMat = this.mat(0x0f172a, 0.1);
    const eyeWhiteMat = this.mat(0xffffff, 0.1);
    [-1, 1].forEach((side) => {
      const ew = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), eyeWhiteMat);
      ew.position.set(0.58, 0.15, side * 0.36);
      const ep = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), eyeMat);
      ep.position.set(0.66, 0.15, side * 0.41);
      fish.add(ew, ep);
    });

    return { group: fish, tail };
  }

  // Load 1 of the 10 Custom 3D Scenes
  loadLevelScene(levelId) {
    this.currentSceneId = levelId;
    this.clearScene();
    this.resetCameraView();

    switch (levelId) {
      case 1:
        this.buildScene1_ClownfishAnemone();
        break;
      case 2:
        this.buildScene2_SharkRemora();
        break;
      case 3:
        this.buildScene3_FernOnOilPalm();
        break;
      case 4:
        this.buildScene4_RafflesiaVine();
        break;
      case 5:
        this.buildScene5_CatAndTapeworm();
        break;
      case 6:
        this.buildScene6_HermitCrabAnemone();
        break;
      case 7:
        this.buildScene7_SymbiosisCrystals();
        break;
      case 8:
        this.buildScene8_CrowdedSaplings();
        break;
      case 9:
        this.buildScene9_OwlAndRat();
        break;
      default:
        this.buildScene10_BossTrophyIsland();
        break;
    }
  }

  // SCENE 1: Clownfish & Sea Anemone (Coral Reef 3D)
  buildScene1_ClownfishAnemone() {
    this.buildIslandBase(0x0ea5e9, 0x0369a1);
    this.buildParticles(0xbae6fd, 50);

    // Coral Reef Rocks
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.6, 1),
      this.mat(0x475569, 0.8)
    );
    rock.scale.set(1.5, 0.7, 1.3);
    rock.position.set(0, -1.0, 0);
    this.rootGroup.add(rock);

    // Sea Anemone Base
    const anemBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.6, 0.9, 20),
      this.mat(0xdb2777, 0.4)
    );
    anemBase.position.set(0, -0.35, 0);
    this.rootGroup.add(anemBase);

    // Waving 3D Tentacles
    const tentacles = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = i % 2 === 0 ? 0.85 : 0.42;
      const tGroup = new THREE.Group();
      tGroup.position.set(Math.cos(angle) * radius, 0.0, Math.sin(angle) * radius);

      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.16, 1.5, 12),
        this.mat(0xf472b6, 0.3)
      );
      stalk.position.y = 0.75;
      tGroup.add(stalk);

      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 12),
        this.mat(0xfde047, 0.2, 0.1, 0xca8a04)
      );
      tip.position.y = 1.55;
      tGroup.add(tip);

      this.rootGroup.add(tGroup);
      tentacles.push({ group: tGroup, phase: i * 0.5 });
    }

    // Animated 3D Clownfish swimming around Anemone
    const { group: clownfish, tail } = this.createFishMesh(0xf97316, 0xffffff, 0.95);
    this.rootGroup.add(clownfish);

    this.animatedObjects.push((t) => {
      tentacles.forEach((item) => {
        item.group.rotation.z = Math.sin(t * 2.2 + item.phase) * 0.22;
        item.group.rotation.x = Math.cos(t * 1.8 + item.phase) * 0.18;
      });
      // Clownfish figure-8 swim
      const swimAngle = t * 1.3;
      clownfish.position.x = Math.cos(swimAngle) * 2.1;
      clownfish.position.z = Math.sin(swimAngle * 2) * 1.2 + 0.8;
      clownfish.position.y = 1.45 + Math.sin(t * 3) * 0.25;
      clownfish.rotation.y = -swimAngle + Math.PI / 2;
      tail.rotation.y = Math.sin(t * 12) * 0.35;
    });
  }

  // SCENE 2: Shark & Remora Hitchhiker (Open Ocean 3D)
  buildScene2_SharkRemora() {
    this.buildIslandBase(0x0369a1, 0x0c4a6e);
    this.buildParticles(0x7dd3fc, 50);

    const sharkGroup = new THREE.Group();
    // Shark Torso
    const body = new THREE.Mesh(
      new THREE.ConeGeometry(1.05, 4.4, 20),
      this.mat(0x64748b, 0.35)
    );
    body.rotation.z = -Math.PI / 2;
    body.scale.set(0.85, 1, 0.75);
    sharkGroup.add(body);

    // White Belly
    const belly = new THREE.Mesh(
      new THREE.SphereGeometry(0.92, 16, 16),
      this.mat(0xf8fafc, 0.4)
    );
    belly.scale.set(1.8, 0.45, 0.68);
    belly.position.set(0.2, -0.32, 0);
    sharkGroup.add(belly);

    // Dorsal Fin
    const dorsal = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 1.35, 4),
      this.mat(0x475569, 0.4)
    );
    dorsal.position.set(0.1, 1.05, 0);
    dorsal.rotation.z = 0.25;
    sharkGroup.add(dorsal);

    // Shark Tail
    const sharkTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 1.3, 4),
      this.mat(0x64748b, 0.4)
    );
    sharkTail.rotation.z = -Math.PI / 2;
    sharkTail.position.set(-2.3, 0.1, 0);
    sharkGroup.add(sharkTail);

    // Eyes
    [-1, 1].forEach((s) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), this.mat(0x0f172a));
      eye.position.set(1.2, 0.2, s * 0.55);
      sharkGroup.add(eye);
    });

    // Attached Remora Fish underneath Shark's belly!
    const { group: remora, tail: remTail } = this.createFishMesh(0x0284c7, 0xfacc15, 0.52);
    remora.position.set(0.2, -0.95, 0);
    sharkGroup.add(remora);

    // Floating Golden Food Scraps
    const scraps = [];
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        this.mat(0xfbbf24, 0.2, 0.2, 0xd97706)
      );
      s.position.set(1.8 - i * 0.4, -0.8 + (i % 2) * 0.25, (i % 3 - 1) * 0.4);
      sharkGroup.add(s);
      scraps.push(s);
    }

    sharkGroup.position.y = 0.9;
    this.rootGroup.add(sharkGroup);

    this.animatedObjects.push((t) => {
      sharkGroup.position.y = 0.9 + Math.sin(t * 2) * 0.25;
      sharkGroup.rotation.y = Math.sin(t * 0.9) * 0.25;
      sharkTail.rotation.y = Math.sin(t * 8) * 0.3;
      remTail.rotation.y = Math.sin(t * 12) * 0.35;
      scraps.forEach((sc, idx) => {
        sc.position.x -= 0.02;
        if (sc.position.x < -1.5) sc.position.x = 2.0;
      });
    });
  }

  // SCENE 3: Bird's Nest Fern on Oil Palm Trunk (Rainforest 3D)
  buildScene3_FernOnOilPalm() {
    this.buildIslandBase(0x15803d, 0x14532d);
    this.buildParticles(0xfef08a, 35);

    // 3D Oil Palm Tree Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 1.05, 4.6, 16),
      this.mat(0x78350f, 0.85)
    );
    trunk.position.set(-0.3, 0.7, 0);
    this.rootGroup.add(trunk);

    // Top Palm Fronds
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.12, 0.45),
        this.mat(0x166534, 0.5)
      );
      frond.position.set(-0.3 + Math.cos(angle) * 1.1, 3.0, Math.sin(angle) * 1.1);
      frond.rotation.y = -angle;
      frond.rotation.z = -0.35;
      this.rootGroup.add(frond);
    }

    // Bird's Nest Fern Perched on Outer Bark
    const fernGroup = new THREE.Group();
    fernGroup.position.set(0.55, 0.65, 0.3);

    const spongeBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 14, 12),
      this.mat(0x92400e, 0.8)
    );
    spongeBase.scale.set(1.1, 0.65, 1.1);
    fernGroup.add(spongeBase);

    const fernLeaves = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.26, 1.35, 5),
        this.mat(0x4ade80, 0.3)
      );
      leaf.position.set(Math.cos(a) * 0.4, 0.55, Math.sin(a) * 0.4);
      leaf.rotation.z = -Math.cos(a) * 0.55;
      leaf.rotation.x = Math.sin(a) * 0.55;
      fernGroup.add(leaf);
      fernLeaves.push(leaf);
    }
    this.rootGroup.add(fernGroup);

    // Glowing 3D Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 20, 20),
      this.mat(0xfacc15, 0.1, 0.1, 0xeab308)
    );
    sun.position.set(2.6, 2.6, -1.0);
    this.rootGroup.add(sun);

    this.animatedObjects.push((t) => {
      sun.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      fernGroup.rotation.z = Math.sin(t * 2) * 0.06;
    });
  }

  // SCENE 4: Giant Rafflesia on Host Vine (Jungle Parasitism 3D)
  buildScene4_RafflesiaVine() {
    this.buildIslandBase(0x3f2314, 0x27171c);
    this.buildParticles(0xf87171, 40);

    // Host Vine across jungle floor
    const vine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.38, 6.5, 16),
      this.mat(0x5c2d16, 0.85)
    );
    vine.rotation.z = Math.PI / 2;
    vine.position.set(0, -1.0, 0);
    this.rootGroup.add(vine);

    // Giant 3D Rafflesia Flower
    const rafGroup = new THREE.Group();
    rafGroup.position.set(0, -0.35, 0);

    // Central bowl
    const centerDome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.8, 0.65, 24),
      this.mat(0xea580c, 0.4)
    );
    rafGroup.add(centerDome);

    const innerHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.6, 0.7, 20),
      this.mat(0x450a0a, 0.8)
    );
    rafGroup.add(innerHole);

    // 5 Big Red Petals with White Spots
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(
        new THREE.SphereGeometry(0.95, 16, 12),
        this.mat(0xdc2626, 0.35)
      );
      petal.scale.set(1.15, 0.25, 0.85);
      petal.position.set(Math.cos(a) * 1.45, 0.1, Math.sin(a) * 1.45);
      petal.rotation.y = -a;
      petal.rotation.z = -0.2;
      rafGroup.add(petal);

      // White bump spots on each petal
      const spot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        this.mat(0xfef2f2, 0.3)
      );
      spot.position.set(Math.cos(a) * 1.5, 0.32, Math.sin(a) * 1.5);
      rafGroup.add(spot);
    }

    this.rootGroup.add(rafGroup);

    this.animatedObjects.push((t) => {
      const pulse = 1 + Math.sin(t * 2.5) * 0.05;
      rafGroup.scale.set(pulse, 1, pulse);
      rafGroup.rotation.y = Math.sin(t * 0.5) * 0.15;
    });
  }

  // SCENE 5: Cat & Tapeworm Vet Clinic 3D
  buildScene5_CatAndTapeworm() {
    this.buildIslandBase(0x4f46e5, 0x312e81);
    this.buildParticles(0xc4b5fd, 35);

    // Cute 3D Cat on Left
    const catGroup = new THREE.Group();
    catGroup.position.set(-1.5, -0.2, 0);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 20), this.mat(0xfb923c, 0.4));
    head.position.y = 0.8;
    catGroup.add(head);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.4, 16), this.mat(0xfb923c, 0.4));
    torso.position.y = -0.3;
    catGroup.add(torso);

    // Cat Ears
    [-1, 1].forEach((s) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.65, 4), this.mat(0xea580c, 0.4));
      ear.position.set(s * 0.55, 1.65, 0);
      ear.rotation.z = -s * 0.3;
      catGroup.add(ear);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), this.mat(0x0f172a));
      eye.position.set(s * 0.35, 0.9, 0.85);
      catGroup.add(eye);
    });

    this.rootGroup.add(catGroup);

    // Wriggling 3D Segmented Tapeworm on Right
    const wormSegments = [];
    const wormGroup = new THREE.Group();
    wormGroup.position.set(1.5, 0.4, 0);
    for (let i = 0; i < 9; i++) {
      const seg = new THREE.Mesh(
        new THREE.SphereGeometry(0.34 - i * 0.015, 14, 14),
        this.mat(0xfef08a, 0.3)
      );
      seg.position.x = (i - 4) * 0.35;
      wormGroup.add(seg);
      wormSegments.push(seg);
    }
    this.rootGroup.add(wormGroup);

    this.animatedObjects.push((t) => {
      catGroup.position.y = -0.2 + Math.sin(t * 2) * 0.1;
      wormSegments.forEach((seg, idx) => {
        seg.position.y = Math.sin(t * 5 + idx * 0.6) * 0.32;
      });
    });
  }

  // SCENE 6: Hermit Crab Carrying Sea Anemone on Shell (3D Beach)
  buildScene6_HermitCrabAnemone() {
    this.buildIslandBase(0xd97706, 0x92400e);
    this.buildParticles(0xfde68a, 40);

    const crabGroup = new THREE.Group();
    crabGroup.position.y = -0.5;

    // Spiral Snail Shell
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 20, 16),
      this.mat(0xb45309, 0.5)
    );
    shell.scale.set(1.3, 1.0, 1.0);
    shell.position.set(-0.2, 0.4, 0);
    crabGroup.add(shell);

    // Big Red Claws & Eyes in front
    [-1, 1].forEach((s) => {
      const claw = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 14, 14),
        this.mat(0xef4444, 0.35)
      );
      claw.scale.set(1.3, 0.7, 0.8);
      claw.position.set(1.35, -0.1, s * 0.85);
      crabGroup.add(claw);

      const eyeStalk = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 12),
        this.mat(0x0f172a)
      );
      eyeStalk.position.set(1.05, 0.65, s * 0.38);
      crabGroup.add(eyeStalk);
    });

    // Sea Anemone riding on top of the crab's shell!
    const anemTop = new THREE.Group();
    anemTop.position.set(-0.2, 1.45, 0);
    const anemBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.7, 0.6, 16),
      this.mat(0xdb2777, 0.4)
    );
    anemTop.add(anemBody);

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const tent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.85, 8),
        this.mat(0xf472b6, 0.3)
      );
      tent.position.set(Math.cos(a) * 0.35, 0.55, Math.sin(a) * 0.35);
      tent.rotation.z = -Math.cos(a) * 0.3;
      anemTop.add(tent);
    }
    crabGroup.add(anemTop);
    this.rootGroup.add(crabGroup);

    this.animatedObjects.push((t) => {
      crabGroup.position.x = Math.sin(t * 1.6) * 0.85;
      crabGroup.rotation.z = Math.sin(t * 8) * 0.05;
      anemTop.rotation.y = t * 0.8;
    });
  }

  // SCENE 7: 3D Symbiosis Crystal Hololab (+/+, +/0, +/-)
  buildScene7_SymbiosisCrystals() {
    this.buildIslandBase(0x1e293b, 0x0f172a);
    this.buildParticles(0x34d399, 50);

    const configs = [
      { x: -2.4, color: 0x10b981, emissive: 0x065f46 }, // Mutualism (+/+)
      { x: 0.0, color: 0x38bdf8, emissive: 0x075985 },  // Commensalism (+/0)
      { x: 2.4, color: 0xf43f5e, emissive: 0x881337 }   // Parasitism (+/-)
    ];

    const crystals = [];
    configs.forEach((cfg, idx) => {
      const cMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.15, 0),
        this.mat(cfg.color, 0.15, 0.3, cfg.emissive)
      );
      cMesh.position.set(cfg.x, 0.8, 0);
      this.rootGroup.add(cMesh);
      crystals.push({ mesh: cMesh, phase: idx * 1.2 });
    });

    this.animatedObjects.push((t) => {
      crystals.forEach((c) => {
        c.mesh.rotation.y = t * 1.4 + c.phase;
        c.mesh.position.y = 0.8 + Math.sin(t * 2.5 + c.phase) * 0.3;
      });
    });
  }

  // SCENE 8: Crowded vs. Spaced 3D Tree Sapling Pots
  buildScene8_CrowdedSaplings() {
    this.buildIslandBase(0x334155, 0x1e293b);
    this.buildParticles(0x86efac, 35);

    // Left Pot: Crowded (Many thin yellow saplings)
    const potLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 0.95, 1.3, 20),
      this.mat(0xb45309, 0.7)
    );
    potLeft.position.set(-1.85, -0.7, 0);
    this.rootGroup.add(potLeft);

    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const r = (i % 3) * 0.32;
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.95, 6),
        this.mat(0xfacc15, 0.6)
      );
      stem.position.set(-1.85 + Math.cos(a) * r, 0.3, Math.sin(a) * r);
      stem.rotation.z = (Math.random() - 0.5) * 0.35;
      this.rootGroup.add(stem);
    }

    // Right Pot: 3 Healthy Tall Green Trees
    const potRight = potLeft.clone();
    potRight.position.set(1.85, -0.7, 0);
    this.rootGroup.add(potRight);

    const healthyTrees = [];
    [-0.55, 0, 0.55].forEach((offset, idx) => {
      const tGrp = new THREE.Group();
      tGrp.position.set(1.85 + offset, 0.4, (idx - 1) * 0.35);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.16, 1.5, 10),
        this.mat(0x78350f, 0.7)
      );
      tGrp.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 16, 16),
        this.mat(0x22c55e, 0.35)
      );
      crown.position.y = 0.95;
      tGrp.add(crown);

      this.rootGroup.add(tGrp);
      healthyTrees.push(tGrp);
    });

    this.animatedObjects.push((t) => {
      healthyTrees.forEach((tr, i) => {
        tr.rotation.z = Math.sin(t * 2 + i) * 0.06;
      });
    });
  }

  // SCENE 9: Barn Owl Swooping Over Oil Palm Estate (Prey-Predator 3D)
  buildScene9_OwlAndRat() {
    this.buildIslandBase(0x064e3b, 0x022c22);
    this.buildParticles(0xfef08a, 40);

    // 3D Barn Owl Flying
    const owlGroup = new THREE.Group();
    owlGroup.position.set(-0.8, 1.5, 0);

    const owlBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 16, 16),
      this.mat(0xf8fafc, 0.4)
    );
    owlBody.scale.set(1, 1.25, 0.85);
    owlGroup.add(owlBody);

    // Wings
    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.12, 0.75),
      this.mat(0xd97706, 0.5)
    );
    leftWing.position.set(-0.9, 0.2, 0);
    owlGroup.add(leftWing);

    const rightWing = leftWing.clone();
    rightWing.position.set(0.9, 0.2, 0);
    owlGroup.add(rightWing);

    this.rootGroup.add(owlGroup);

    // 3D Rat on Ground
    const ratGroup = new THREE.Group();
    ratGroup.position.set(1.4, -1.0, 0.5);
    const ratBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 14, 14),
      this.mat(0x94a3b8, 0.5)
    );
    ratBody.scale.set(1.4, 0.8, 0.85);
    ratGroup.add(ratBody);
    this.rootGroup.add(ratGroup);

    this.animatedObjects.push((t) => {
      owlGroup.position.y = 1.4 + Math.sin(t * 3) * 0.35;
      owlGroup.position.x = -0.5 + Math.cos(t * 1.5) * 0.9;
      leftWing.rotation.z = Math.sin(t * 10) * 0.45;
      rightWing.rotation.z = -Math.sin(t * 10) * 0.45;
      ratGroup.position.x = 1.2 + Math.sin(t * 4) * 0.4;
    });
  }

  // SCENE 10: Final Boss Golden Trophy 3D Island
  buildScene10_BossTrophyIsland() {
    this.buildIslandBase(0x059669, 0x065f46);
    this.buildParticles(0xfde047, 65);

    const trophyGroup = new THREE.Group();
    trophyGroup.position.y = 0.4;

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 0.55, 1.6, 24),
      this.mat(0xfacc15, 0.2, 0.6, 0xca8a04)
    );
    cup.position.y = 0.6;
    trophyGroup.add(cup);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 1.05, 0.7, 20),
      this.mat(0xb45309, 0.4)
    );
    pedestal.position.y = -0.6;
    trophyGroup.add(pedestal);

    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      this.mat(0xfef08a, 0.1, 0.4, 0xeab308)
    );
    star.position.y = 2.0;
    trophyGroup.add(star);

    this.rootGroup.add(trophyGroup);

    this.animatedObjects.push((t) => {
      trophyGroup.rotation.y = t * 1.2;
      star.rotation.y = -t * 2.5;
      star.position.y = 2.0 + Math.sin(t * 3) * 0.2;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera) return;

    const dt = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Auto gentle rotation when not dragging
    if (!this.isDragging) {
      this.targetRotY += 0.0035;
    }

    // Smooth damping for 3D camera rotation
    this.currentRotY += (this.targetRotY - this.currentRotY) * 0.1;
    this.currentRotX += (this.targetRotX - this.currentRotX) * 0.1;

    if (this.rootGroup) {
      this.rootGroup.rotation.y = this.currentRotY;
      this.rootGroup.rotation.x = this.currentRotX;

      if (this.jumpBoost > 0.01) {
        this.rootGroup.position.y = Math.sin(this.jumpBoost * Math.PI) * 0.65;
        this.jumpBoost = Math.max(0, this.jumpBoost - dt * 2.4);
      } else {
        this.rootGroup.position.y = 0;
      }
    }

    this.camera.position.z += (this.cameraDistance - this.camera.position.z) * 0.12;

    this.animatedObjects.forEach((fn) => fn(elapsed));
    this.renderer.render(this.scene, this.camera);
  }
}

window.EcoWorld3D = EcoWorld3D;
