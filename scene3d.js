// ============================================================================
// ECOQUEST 3D — HIGH-CRAFT ISOMETRIC 3D DIORAMA ENGINE (Three.js)
// Procedural Lathe, Extrude & Spline-Tube 3D Sculpted Animals, Plants & Blocks
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

    this.camState = {
      theta: 0.42,
      phi: 1.1,
      radius: 14.5,
      targetTheta: 0.42,
      targetPhi: 1.1,
      targetRadius: 14.5,
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
    const w = this.container.clientWidth || 380;
    const h = this.container.clientHeight || 310;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.015);

    this.camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 160);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    this.dioramaGroup = new THREE.Group();
    this.scene.add(this.dioramaGroup);

    window.addEventListener("resize", () => this.resize());
  }

  initLights() {
    const hemi = new THREE.HemisphereLight(0xf0f9ff, 0x0f172a, 1.05);
    this.scene.add(hemi);

    this.keyLight = new THREE.DirectionalLight(0xfffbeb, 1.75);
    this.keyLight.position.set(10, 18, 12);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    const d = 6.5;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.PointLight(0x38bdf8, 1.6, 30);
    this.rimLight.position.set(-9, 7, -8);
    this.scene.add(this.rimLight);

    this.fillLight = new THREE.PointLight(0x10b981, 1.1, 25);
    this.fillLight.position.set(7, -2, 7);
    this.scene.add(this.fillLight);
  }

  initAmbientParticles() {
    const count = 80;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.11,
      transparent: true,
      opacity: 0.5
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
        0.5,
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
    this.resize();
  }

  updateCenterOffset() {
    if (!this.camera) return;
    this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  }

  setCameraPreset(preset) {
    if (preset === "front") {
      this.camState.targetTheta = 0.42;
      this.camState.targetPhi = 1.1;
      this.camState.targetRadius = 14.5;
    } else if (preset === "top") {
      this.camState.targetTheta = Math.PI / 4;
      this.camState.targetPhi = 0.82;
      this.camState.targetRadius = 15.5;
    } else if (preset === "closeup") {
      this.camState.targetTheta = 0.28;
      this.camState.targetPhi = 1.16;
      this.camState.targetRadius = 10.5;
    } else if (preset === "orbit") {
      this.camState.autoOrbit = !this.camState.autoOrbit;
      const btn = document.getElementById("btn-cam-orbit");
      if (btn) btn.classList.toggle("active", this.camState.autoOrbit);
    }
  }

  resize() {
    if (!this.renderer || !this.camera || !this.container) return;
    const w = this.container.clientWidth || 380;
    const h = this.container.clientHeight || 310;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  setSimValue(val) {
    this.targetSimValue = Math.max(0, Math.min(100, Number(val)));
  }

  triggerFeedbackPulse() {
    const prev = this.camState.targetRadius;
    this.camState.targetRadius = Math.max(10.5, prev - 1.8);
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
  // PROCEDURAL 3D SCULPTING HELPERS (Extruded Fins, Spline Tubes, 3D Leaves)
  // ==========================================================================
  createExtrudedLeaf(length = 1.0, width = 0.28, color = 0x10b981, curveUp = 0.15) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(length * 0.5, width, length, 0);
    shape.quadraticCurveTo(length * 0.5, -width, 0, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2
    });
    // Bend vertices slightly for organic arch
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const t = px / length;
      pos.setZ(i, pos.getZ(i) + Math.sin(t * Math.PI) * curveUp);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    return mesh;
  }

  createSplineTube(pointsArray, radius = 0.08, color = 0x10b981) {
    const curve = new THREE.CatmullRomCurve3(
      pointsArray.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    );
    const geo = new THREE.TubeGeometry(curve, 20, radius, 12, false);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    return mesh;
  }

  createSeatedEyes(parent, x, y, zSpread, radius = 0.075) {
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

    [-zSpread, zSpread].forEach((z) => {
      const sign = z >= 0 ? 1 : -1;
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(x, y, z);

      const white = new THREE.Mesh(new THREE.SphereGeometry(radius, 14, 14), scleraMat);
      eyeGroup.add(white);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.58, 12, 12), pupilMat);
      pupil.position.set(radius * 0.42, 0, sign * radius * 0.45);
      eyeGroup.add(pupil);

      parent.add(eyeGroup);
    });
  }

  // Detailed Feathered 3D Oil Palm Tree Builder
  createFeatheredPalmTree(height = 2.8) {
    const palm = new THREE.Group();

    // Ringed Trunk built from tapered bark segments
    const segs = 9;
    const segH = height / segs;
    for (let i = 0; i < segs; i++) {
      const rBot = 0.36 - (i / segs) * 0.1;
      const rTop = 0.32 - (i / segs) * 0.08;
      const col = i % 2 === 0 ? 0x6b4423 : 0x54341a;
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(rTop, rBot, segH + 0.02, 14),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 })
      );
      cyl.position.y = i * segH + segH * 0.5;
      cyl.castShadow = true;
      palm.add(cyl);
    }

    // Ripe Red-Orange Oil Palm Fruit Bunches nestled under crown
    const fruitMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35 });
    for (let b = 0; b < 4; b++) {
      const ang = (b / 4) * Math.PI * 2 + 0.4;
      const bunch = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 1), fruitMat);
      bunch.position.set(Math.cos(ang) * 0.28, height - 0.15, Math.sin(ang) * 0.28);
      palm.add(bunch);
    }

    // 10 Arching Feathered Fronds at Crown
    const frondCount = 10;
    for (let f = 0; f < frondCount; f++) {
      const ang = (f / frondCount) * Math.PI * 2;
      const tier = f % 2 === 0 ? 0.15 : -0.1;
      const frondGroup = new THREE.Group();
      frondGroup.position.set(0, height, 0);
      frondGroup.rotation.y = ang;
      frondGroup.rotation.z = -0.25 + tier;

      // Curved Stem Spine
      const spine = this.createSplineTube(
        [
          [0, 0, 0],
          [0.65, 0.28, 0],
          [1.35, 0.05, 0],
          [1.85, -0.35, 0]
        ],
        0.035,
        0x15803d
      );
      frondGroup.add(spine);

      // Pinnae Leaflets along both sides of spine
      for (let l = 1; l <= 7; l++) {
        const t = l / 8;
        const lx = t * 1.75;
        const ly = Math.sin(t * Math.PI) * 0.22 - t * 0.18;
        [-1, 1].forEach((side) => {
          const leaflet = this.createExtrudedLeaf(0.42 * (1 - t * 0.35), 0.06, 0x16a34a, 0.04);
          leaflet.position.set(lx, ly, 0);
          leaflet.rotation.y = side * 1.1;
          leaflet.rotation.x = side * 0.25;
          frondGroup.add(leaflet);
        });
      }
      palm.add(frondGroup);
    }

    return palm;
  }

  // Sculpted 3D Clownfish with Beveled Extruded Fins & Lathe Contour
  createClownfish3D(scale = 1.0) {
    const fish = new THREE.Group();
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.25 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

    // Sculpted Torso
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.46, 28, 28), orangeMat);
    body.scale.set(1.55, 0.92, 0.68);
    body.castShadow = true;
    fish.add(body);

    // 2 Curved White Bands with Black Outlines
    [0.18, -0.22].forEach((sx, idx) => {
      const r = idx === 0 ? 0.415 : 0.36;
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.15, 24), whiteMat);
      stripe.rotation.z = Math.PI / 2;
      stripe.scale.set(0.92, 1, 0.7);
      stripe.position.x = sx;
      fish.add(stripe);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.004, r + 0.004, 0.19, 24), blackMat);
      rim.rotation.z = Math.PI / 2;
      rim.scale.set(0.91, 1, 0.69);
      rim.position.x = sx;
      fish.add(rim);
    });

    // Beveled Extruded Dorsal Fin
    const dorsal = this.createExtrudedLeaf(0.55, 0.22, 0xf97316, 0.02);
    dorsal.position.set(-0.25, 0.35, -0.02);
    dorsal.rotation.z = 0.45;
    fish.add(dorsal);

    // Beveled Pectoral Fins attached directly to body sides
    [-0.28, 0.28].forEach((z) => {
      const pec = this.createExtrudedLeaf(0.36, 0.14, 0xf97316, 0.02);
      pec.position.set(0.12, -0.06, z);
      pec.rotation.y = z > 0 ? -0.9 : 0.9;
      fish.add(pec);
    });

    // Beveled Rounded Caudal Tail Fin
    const tailShape = new THREE.Shape();
    tailShape.moveTo(0, 0);
    tailShape.quadraticCurveTo(-0.35, 0.36, -0.52, 0.28);
    tailShape.quadraticCurveTo(-0.38, 0, -0.52, -0.28);
    tailShape.quadraticCurveTo(-0.35, -0.36, 0, 0);
    const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02
    });
    const tail = new THREE.Mesh(tailGeo, orangeMat);
    tail.position.set(-0.62, 0, -0.02);
    fish.add(tail);
    fish.userData.tail = tail;

    // Seated Eyes on head surface
    this.createSeatedEyes(fish, 0.46, 0.1, 0.2, 0.08);

    // Mucus Shield
    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.2, wireframe: true })
    );
    fish.add(shield);
    fish.userData.shield = shield;

    fish.scale.setScalar(scale);
    return fish;
  }

  // Complete 4-Legged Sculpted 3D Mammal Builder (Used for Cat, Dog, Water Buffalo, Rat)
  createQuadrupedMammal({
    bodyColor = 0xfb923c,
    bellyColor = 0xffedd5,
    legHeight = 0.55,
    bodyLength = 1.25,
    bodyRadius = 0.44,
    earType = "pointed", // "pointed" | "floppy" | "horns" | "round"
    tailLength = 0.8
  }) {
    const animal = new THREE.Group();
    const mainMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.45 });
    const accentMat = new THREE.MeshStandardMaterial({ color: bellyColor, roughness: 0.5 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    // 4 Jointed Legs with Paws/Hooves standing firmly on ground (y = 0)
    const legPositions = [
      [bodyLength * 0.34, legHeight * 0.5, 0.22],
      [bodyLength * 0.34, legHeight * 0.5, -0.22],
      [-bodyLength * 0.34, legHeight * 0.5, 0.22],
      [-bodyLength * 0.34, legHeight * 0.5, -0.22]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.09, legHeight, 12),
        mainMat
      );
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      animal.add(leg);

      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), accentMat);
      paw.scale.set(1.25, 0.65, 1.0);
      paw.position.set(lx + 0.04, 0.06, lz);
      animal.add(paw);
    });

    // Sculpted Torso Capsule resting on top of legs
    const torsoY = legHeight + bodyRadius * 0.72;
    const torso = new THREE.Mesh(new THREE.SphereGeometry(bodyRadius, 24, 24), mainMat);
    torso.scale.set(bodyLength / (bodyRadius * 2) + 0.45, 0.92, 0.85);
    torso.position.set(0, torsoY, 0);
    torso.castShadow = true;
    animal.add(torso);

    // Chest / Neck
    const headX = bodyLength * 0.48;
    const headY = torsoY + bodyRadius * 0.62;
    const head = new THREE.Mesh(new THREE.SphereGeometry(bodyRadius * 0.82, 24, 24), mainMat);
    head.position.set(headX, headY, 0);
    head.castShadow = true;
    animal.add(head);

    // Snout / Muzzle connected to front of head
    const snout = new THREE.Mesh(new THREE.SphereGeometry(bodyRadius * 0.46, 18, 18), accentMat);
    snout.scale.set(1.25, 0.8, 0.95);
    snout.position.set(headX + bodyRadius * 0.68, headY - 0.08, 0);
    animal.add(snout);

    // Nose tip
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 12, 12),
      new THREE.MeshStandardMaterial({ color: earType === "pointed" ? 0xf43f5e : 0x0f172a })
    );
    nose.position.set(headX + bodyRadius * 1.15, headY - 0.02, 0);
    animal.add(nose);

    // Properly Seated Eyes on head surface
    this.createSeatedEyes(
      animal,
      headX + bodyRadius * 0.55,
      headY + 0.1,
      bodyRadius * 0.44,
      0.075
    );

    // Ears or Horns
    if (earType === "pointed") {
      [-0.22, 0.22].forEach((z) => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.34, 12), mainMat);
        ear.position.set(headX - 0.04, headY + bodyRadius * 0.78, z);
        ear.rotation.x = z > 0 ? 0.2 : -0.2;
        animal.add(ear);
      });
    } else if (earType === "floppy") {
      [-0.3, 0.3].forEach((z) => {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), darkMat);
        ear.scale.set(0.65, 1.55, 0.35);
        ear.position.set(headX - 0.05, headY + 0.02, z);
        ear.rotation.x = z > 0 ? -0.35 : 0.35;
        animal.add(ear);
      });
    } else if (earType === "horns") {
      // Curved 3D Buffalo Horns
      [-1, 1].forEach((side) => {
        const horn = this.createSplineTube(
          [
            [headX - 0.05, headY + 0.22, side * 0.22],
            [headX - 0.15, headY + 0.32, side * 0.62],
            [headX + 0.08, headY + 0.62, side * 0.72]
          ],
          0.075,
          0x1e293b
        );
        animal.add(horn);
      });
    } else if (earType === "round") {
      [-0.18, 0.18].forEach((z) => {
        const ear = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0xfda4af })
        );
        ear.scale.set(0.4, 1, 1);
        ear.position.set(headX - 0.06, headY + bodyRadius * 0.7, z);
        animal.add(ear);
      });
    }

    // Curved Spline Tail attached to rear of torso
    const tail = this.createSplineTube(
      [
        [-bodyLength * 0.45, torsoY + 0.05, 0],
        [-bodyLength * 0.45 - tailLength * 0.5, torsoY + 0.28, 0.1],
        [-bodyLength * 0.45 - tailLength, torsoY + 0.52, -0.05]
      ],
      0.065,
      bodyColor
    );
    animal.add(tail);

    return animal;
  }

  // ==========================================================================
  // 3D ISOMETRIC CUTAWAY DIORAMA CUBE BUILDER
  // ==========================================================================
  createIsoBlock({
    topColor = 0xd97706,
    midColor = 0x78350f,
    baseColor = 0x1e293b,
    waterColor = null,
    waterHeight = 2.8,
    size = 5.4
  } = {}) {
    const block = new THREE.Group();

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(size + 0.28, 0.38, size + 0.28),
      new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.45, metalness: 0.2 })
    );
    frame.position.y = -2.25;
    frame.receiveShadow = true;
    block.add(frame);

    const mid = new THREE.Mesh(
      new THREE.BoxGeometry(size, 0.65, size),
      new THREE.MeshStandardMaterial({ color: midColor, roughness: 0.75 })
    );
    mid.position.y = -1.75;
    mid.receiveShadow = true;
    block.add(mid);

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(size, 0.34, size),
      new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.55 })
    );
    top.position.y = -1.26;
    top.receiveShadow = true;
    block.add(top);

    if (waterColor !== null) {
      const waterCube = new THREE.Mesh(
        new THREE.BoxGeometry(size - 0.04, waterHeight, size - 0.04),
        new THREE.MeshStandardMaterial({
          color: waterColor,
          transparent: true,
          opacity: 0.22,
          roughness: 0.12,
          metalness: 0.1,
          depthWrite: false
        })
      );
      waterCube.position.y = -1.09 + waterHeight / 2;
      block.add(waterCube);

      const rim = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size, waterHeight, size)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
      );
      rim.position.y = -1.09 + waterHeight / 2;
      block.add(rim);
    } else {
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size + 0.3, 0.38, size + 0.3)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.32 })
      );
      outline.position.y = -2.25;
      block.add(outline);
    }

    // Natural 3D Rocks & Foliage Tufts on corners
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true });
    [
      [-2.15, -2.0],
      [2.15, -2.05],
      [-2.05, 2.15]
    ].forEach(([px, pz], idx) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24 + idx * 0.04, 0), rockMat);
      rock.scale.set(1.2, 0.65, 1.0);
      rock.position.set(px, -1.02, pz);
      rock.castShadow = true;
      block.add(rock);
    });

    this.dioramaGroup.add(block);
    return block;
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
    if (!this.camera || !this.container) return;
    const w = this.container.clientWidth || 380;
    const h = this.container.clientHeight || 310;
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
  // STAGE 1: 3D ISO CORAL REEF AQUARIUM — CLOWNFISH & SEA ANEMONE (+ / +)
  // ==========================================================================
  buildStage1_ReefMutualism() {
    this.createIsoBlock({
      topColor: 0xfbbf24,
      midColor: 0xb45309,
      waterColor: 0x0ea5e9,
      waterHeight: 3.2
    });

    // Multi-Rock Coral Reef Outcrop
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, flatShading: true });
    const mainRock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25, 1), rockMat);
    mainRock.scale.set(1.25, 0.65, 1.15);
    mainRock.position.set(0.85, -0.85, 0);
    this.dioramaGroup.add(mainRock);

    // Branching Staghorn Coral on left
    const coralBranch1 = this.createSplineTube(
      [[-1.6, -1.1, 1.1], [-1.5, -0.35, 1.1], [-1.2, 0.15, 0.9]],
      0.09,
      0xa855f7
    );
    const coralBranch2 = this.createSplineTube(
      [[-1.5, -0.5, 1.1], [-1.85, 0.05, 1.25]],
      0.075,
      0xa855f7
    );
    this.dioramaGroup.add(coralBranch1, coralBranch2);

    // 3D Sea Anemone with 26 Curved Tentacles
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
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2;
      const rad = i % 2 === 0 ? 0.64 : 0.34;
      const tPivot = new THREE.Group();
      tPivot.position.set(Math.cos(angle) * rad, 0.3, Math.sin(angle) * rad);

      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.09, 1.2, 12), tentMat);
      stalk.position.y = 0.6;
      tPivot.add(stalk);

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), tipMat);
      tip.position.y = 1.22;
      tPivot.add(tip);

      tPivot.userData = { phase: i * 0.5 };
      anemGroup.add(tPivot);
      tentacles.push(tPivot);
    }
    this.dioramaGroup.add(anemGroup);
    this.actors.tentacles = tentacles;

    const fish = this.createClownfish3D(1.05);
    fish.position.set(0.6, 0.7, 0.15);
    this.dioramaGroup.add(fish);
    this.actors.clownfish = fish;

    this.addPin("3D Clownfish", "+ Protected Shelter", "#10b981", new THREE.Vector3(0.6, 1.5, 0.15));
    this.addPin("3D Sea Anemone", "+ Cleaned & Defended", "#38bdf8", new THREE.Vector3(1.15, 0.15, -0.5));
  }

  // ==========================================================================
  // STAGE 2: 3D ISO OCEAN CUBE — STREAMLINED 3D SHARK & REMORA (+ / 0)
  // ==========================================================================
  buildStage2_SharkRemora() {
    this.createIsoBlock({
      topColor: 0x334155,
      midColor: 0x1e293b,
      waterColor: 0x0284c7,
      waterHeight: 3.3
    });

    const shark = new THREE.Group();
    const sharkMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.28, metalness: 0.15 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });

    // Streamlined Shark Fuselage
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), sharkMat);
    body.scale.set(2.45, 0.78, 0.82);
    body.castShadow = true;
    shark.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.7, 28, 28), bellyMat);
    belly.scale.set(2.25, 0.58, 0.76);
    belly.position.y = -0.16;
    shark.add(belly);

    // Swept-Back Beveled Extruded Dorsal Fin
    const dShape = new THREE.Shape();
    dShape.moveTo(-0.35, 0);
    dShape.quadraticCurveTo(0.1, 0.95, 0.45, 0);
    dShape.closePath();
    const dorsal = new THREE.Mesh(
      new THREE.ExtrudeGeometry(dShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }),
      sharkMat
    );
    dorsal.position.set(-0.05, 0.48, -0.03);
    shark.add(dorsal);

    // Swept Pectoral Fins attached cleanly to lower flanks
    [-0.52, 0.52].forEach((z) => {
      const pec = this.createExtrudedLeaf(0.85, 0.24, 0x475569, 0.02);
      pec.position.set(0.25, -0.22, z);
      pec.rotation.y = z > 0 ? -1.1 : 1.1;
      pec.rotation.x = z > 0 ? 0.35 : -0.35;
      shark.add(pec);
    });

    // Crescent Caudal Tail Fin
    const tShape = new THREE.Shape();
    tShape.moveTo(0, 0);
    tShape.quadraticCurveTo(-0.55, 0.85, -0.85, 0.75);
    tShape.quadraticCurveTo(-0.45, 0, -0.75, -0.6);
    tShape.quadraticCurveTo(-0.45, -0.65, 0, 0);
    const tail = new THREE.Mesh(
      new THREE.ExtrudeGeometry(tShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }),
      sharkMat
    );
    tail.position.set(-1.65, 0.05, -0.025);
    shark.add(tail);
    shark.userData.tail = tail;

    // Properly Seated Eyes on Shark Snout Sides (NOT floating!)
    this.createSeatedEyes(shark, 1.15, 0.1, 0.36, 0.085);

    shark.position.set(0, 0.72, 0);
    this.dioramaGroup.add(shark);
    this.actors.shark = shark;

    // Sculpted 3D Remora with Ribbed Dorsal Suction Disc
    const remora = new THREE.Group();
    const remMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25 });
    const remBody = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), remMat);
    remBody.scale.set(2.2, 0.55, 0.62);
    remora.add(remBody);

    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.07, 16),
      new THREE.MeshStandardMaterial({ color: 0x0369a1 })
    );
    pad.scale.set(1.65, 1, 0.65);
    pad.position.set(0.12, 0.16, 0);
    remora.add(pad);

    this.createSeatedEyes(remora, 0.38, 0.03, 0.13, 0.045);

    remora.position.set(0.15, 0.08, 0);
    this.dioramaGroup.add(remora);
    this.actors.remora = remora;

    this.addPin("3D Reef Shark", "0 Unaffected Host", "#94a3b8", new THREE.Vector3(0.1, 1.75, 0));
    this.addPin("3D Remora Fish", "+ Transport & Scraps", "#38bdf8", new THREE.Vector3(0.2, -0.35, 0.45));
  }

  // ==========================================================================
  // STAGE 3: 3D ISO RAINFOREST — FEATHERED OIL PALM & BIRD'S NEST FERN (+ / 0)
  // ==========================================================================
  buildStage3_FernPalmXRay() {
    this.createIsoBlock({ topColor: 0x16a34a, midColor: 0x78350f });

    // Full Feathered 3D Oil Palm Tree
    const palm = this.createFeatheredPalmTree(3.1);
    palm.position.y = -1.1;
    this.dioramaGroup.add(palm);

    // Internal Glowing Blue Vascular Sap Conduits
    const sapMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-0.14, 0, 0.14].forEach((x) => {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.9, 12), sapMat);
      tube.position.set(x, 0.4, 0.25);
      this.dioramaGroup.add(tube);
    });

    // Holographic X-Ray Scanner Ring
    const xrayRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.045, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    xrayRing.rotation.x = Math.PI / 2;
    xrayRing.position.y = 0.35;
    this.dioramaGroup.add(xrayRing);
    this.actors.xrayRing = xrayRing;

    // Sculpted 3D Bird's Nest Fern Rosette clasping right bark
    const fern = new THREE.Group();
    fern.position.set(0.36, 0.35, 0);

    const nest = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    nest.scale.set(1.1, 0.75, 1.1);
    fern.add(nest);

    // 12 Arching Extruded Lance Fronds radiating like a crown
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const frond = this.createExtrudedLeaf(1.05, 0.16, 0x10b981, 0.18);
      frond.position.set(Math.cos(ang) * 0.15, 0.08, Math.sin(ang) * 0.15);
      frond.rotation.y = -ang;
      frond.rotation.z = 0.68;
      fern.add(frond);
    }
    this.dioramaGroup.add(fern);

    this.addPin("Bird's Nest Fern", "+ Sunlit Canopy Epiphyte", "#10b981", new THREE.Vector3(1.15, 1.15, 0));
    this.addPin("Oil Palm Trunk", "0 Vascular Sap Untouched", "#38bdf8", new THREE.Vector3(-0.75, 0.65, 0));
  }

  // ==========================================================================
  // STAGE 4: 3D ISO JUNGLE FLOOR — SCULPTED RAFFLESIA & TETRASTIGMA VINE (+ / -)
  // ==========================================================================
  buildStage4_Rafflesia() {
    this.createIsoBlock({ topColor: 0x14532d, midColor: 0x451a03 });

    // Winding Spline Tetrastigma Vine with 3D Extruded Leaves
    const vine = this.createSplineTube(
      [
        [-2.3, -0.95, 0.3],
        [-0.9, -0.9, -0.2],
        [0.8, -0.92, 0.2],
        [2.3, -0.95, -0.3]
      ],
      0.2,
      0x4d7c0f
    );
    this.dioramaGroup.add(vine);

    [-1.8, -1.2, 1.3, 1.9].forEach((vx, idx) => {
      const vLeaf = this.createExtrudedLeaf(0.55, 0.22, 0x65a30d, 0.08);
      vLeaf.position.set(vx, -0.78, idx % 2 === 0 ? 0.25 : -0.25);
      vLeaf.rotation.y = idx * 1.1;
      this.dioramaGroup.add(vLeaf);
    });

    // 5-Petalled Sculpted Rafflesia Arnoldii
    const rafflesia = new THREE.Group();
    rafflesia.position.set(0, -0.58, 0);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.38 });
    const wartMat = new THREE.MeshStandardMaterial({ color: 0xffe4e6 });

    for (let i = 0; i < 5; i++) {
      const pGroup = new THREE.Group();
      pGroup.rotation.y = (i * Math.PI * 2) / 5;

      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.76, 24, 24), petalMat);
      petal.scale.set(0.95, 0.22, 1.18);
      petal.position.set(0, 0.14, 1.02);
      petal.rotation.x = -0.18;
      petal.castShadow = true;
      pGroup.add(petal);

      [-0.22, 0.22, 0].forEach((wx, idx) => {
        const wart = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), wartMat);
        wart.position.set(wx, 0.3, 0.88 + idx * 0.2);
        pGroup.add(wart);
      });
      rafflesia.add(pGroup);
    }

    const corona = new THREE.Mesh(
      new THREE.TorusGeometry(0.6, 0.22, 18, 36),
      new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.42 })
    );
    corona.rotation.x = Math.PI / 2;
    corona.position.y = 0.24;
    rafflesia.add(corona);

    this.dioramaGroup.add(rafflesia);
    this.actors.rafflesia = rafflesia;

    this.addPin("3D Rafflesia Flower", "+ Absorbs Host Vine Sap", "#f43f5e", new THREE.Vector3(0, 0.95, 0));
    this.addPin("Tetrastigma Vine", "- Drained Host Vine", "#f59e0b", new THREE.Vector3(-1.75, -0.35, 0));
  }

  // ==========================================================================
  // STAGE 5: 3D ISO VET LAB — 4-LEGGED 3D CAT HOST & INTESTINAL TAPEWORM (+ / -)
  // ==========================================================================
  buildStage5_CatTapeworm() {
    this.createIsoBlock({ topColor: 0x334155, midColor: 0x1e293b });

    // 1. Complete 4-Legged Sculpted Ginger Cat on Left Side
    const cat = this.createQuadrupedMammal({
      bodyColor: 0xf97316,
      bellyColor: 0xffedd5,
      legHeight: 0.55,
      bodyLength: 1.15,
      bodyRadius: 0.4,
      earType: "pointed",
      tailLength: 0.75
    });
    cat.position.set(-1.15, -1.08, 0.35);
    this.dioramaGroup.add(cat);
    this.actors.cat = cat;

    // 2. Translucent 3D Intestinal Lumen Tube & Undulating Tapeworm on Right
    const lumen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 2.6, 24),
      new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        transparent: true,
        opacity: 0.28,
        roughness: 0.2
      })
    );
    lumen.rotation.z = Math.PI / 2;
    lumen.position.set(0.85, 0.55, -0.35);
    this.dioramaGroup.add(lumen);

    const wormSegments = [];
    const segMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 });
    for (let i = 0; i < 15; i++) {
      const seg = new THREE.Mesh(
        i === 0 ? new THREE.SphereGeometry(0.22, 16, 16) : new THREE.BoxGeometry(0.15, 0.28, 0.12),
        segMat
      );
      seg.position.set(-0.15 + i * 0.145, 0.55, -0.35);
      this.dioramaGroup.add(seg);
      wormSegments.push(seg);
    }
    this.actors.wormSegments = wormSegments;

    this.addPin("Intestinal Tapeworm", "+ Parasite (Steals Nutrients)", "#10b981", new THREE.Vector3(0.95, 1.35, -0.35));
    this.addPin("3D Host Cat", "- Malnourished Host", "#f43f5e", new THREE.Vector3(-1.05, 0.85, 0.35));
  }

  // ==========================================================================
  // STAGE 6: 3D ISO TIDEPOOL — JOINTED HERMIT CRAB + ANEMONE VS OCTOPUS (+ / +)
  // ==========================================================================
  buildStage6_HermitCrabOctopus() {
    this.createIsoBlock({
      topColor: 0xf59e0b,
      midColor: 0x92400e,
      waterColor: 0x0ea5e9,
      waterHeight: 3.1
    });

    // Complete Jointed 3D Hermit Crab + Spiral Shell + Sea Anemone
    const crabGroup = new THREE.Group();
    crabGroup.position.set(-0.75, -0.75, 0);

    // Coiled Spiral Snail Shell built from progressive spheres
    const shellMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    for (let s = 0; s < 6; s++) {
      const r = 0.65 - s * 0.08;
      const coil = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 18), shellMat);
      coil.position.set(-0.15 - s * 0.12, 0.1 + s * 0.06, (s % 2) * 0.05);
      crabGroup.add(coil);
    }

    // Crab Cephalothorax emerging from shell front
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 });
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 18), redMat);
    thorax.position.set(0.42, -0.05, 0);
    crabGroup.add(thorax);

    // Connected Eye Stalks + Eyes
    [-0.16, 0.16].forEach((z) => {
      const stalk = this.createSplineTube(
        [
          [0.55, 0.05, z],
          [0.72, 0.32, z * 1.2]
        ],
        0.035,
        0xef4444
      );
      crabGroup.add(stalk);
    });
    this.createSeatedEyes(crabGroup, 0.74, 0.34, 0.19, 0.07);

    // Jointed Cheliped Arms + Pincer Claws
    [-1, 1].forEach((side) => {
      const arm = this.createSplineTube(
        [
          [0.45, -0.08, side * 0.32],
          [0.78, -0.14, side * 0.55],
          [1.05, -0.12, side * 0.42]
        ],
        0.075,
        0xef4444
      );
      crabGroup.add(arm);

      const pincer = this.createExtrudedLeaf(0.42, 0.16, 0xdc2626, 0.04);
      pincer.position.set(0.98, -0.15, side * 0.42);
      crabGroup.add(pincer);
    });

    // 6 Jointed Walking Legs touching seabed
    [-1, 1].forEach((side) => {
      for (let l = 0; l < 3; l++) {
        const leg = this.createSplineTube(
          [
            [0.35 - l * 0.18, -0.1, side * 0.35],
            [0.42 - l * 0.18, -0.05, side * 0.68],
            [0.48 - l * 0.18, -0.34, side * 0.82]
          ],
          0.045,
          0xef4444
        );
        crabGroup.add(leg);
      }
    });

    // Sea Anemone riding on top of shell
    const anem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.44, 0.45, 18),
      new THREE.MeshStandardMaterial({ color: 0xdb2777 })
    );
    anem.position.set(-0.15, 0.85, 0);
    crabGroup.add(anem);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const t = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.055, 0.5, 8),
        new THREE.MeshBasicMaterial({ color: 0xf472b6 })
      );
      t.position.set(-0.15 + Math.cos(ang) * 0.25, 1.22, Math.sin(ang) * 0.25);
      crabGroup.add(t);
    }

    this.dioramaGroup.add(crabGroup);
    this.actors.crabGroup = crabGroup;

    // Sculpted 3D Octopus with 8 Curling Spline Tentacles
    const octo = new THREE.Group();
    const octoMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.32 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 24), octoMat);
    head.scale.set(1.0, 1.22, 1.0);
    octo.add(head);

    this.createSeatedEyes(octo, -0.46, -0.05, 0.24, 0.095);

    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      const tent = this.createSplineTube(
        [
          [c * 0.35, -0.35, s * 0.35],
          [c * 0.68, -0.65, s * 0.68],
          [c * 0.95, -0.52, s * 0.95]
        ],
        0.075,
        0x7c3aed
      );
      octo.add(tent);
    }

    octo.position.set(1.6, 0.45, 0);
    this.dioramaGroup.add(octo);
    this.actors.octo = octo;

    this.addPin("Hermit Crab & Anemone", "+ Shield & Mobility [+ / +]", "#10b981", new THREE.Vector3(-0.6, 1.25, 0));
    this.addPin("3D Octopus Predator", "Deterred by Stings", "#a855f7", new THREE.Vector3(1.6, 1.35, 0));
  }

  // ==========================================================================
  // STAGE 7: 3D ISO TRIO — 4-LEGGED BUFFALO & MYNAH, ORCHID, 4-LEGGED DOG & TICK
  // ==========================================================================
  buildStage7_IsoTrioModels() {
    this.createIsoBlock({ topColor: 0x15803d, midColor: 0x78350f, size: 5.8 });

    // 1. Left: 4-Legged 3D Water Buffalo with Curved Horns + Mynah Bird [+ / +]
    const buffalo = this.createQuadrupedMammal({
      bodyColor: 0x475569,
      bellyColor: 0x334155,
      legHeight: 0.52,
      bodyLength: 1.15,
      bodyRadius: 0.42,
      earType: "horns",
      tailLength: 0.55
    });
    buffalo.scale.setScalar(0.82);
    buffalo.position.set(-1.75, -1.08, 0);

    // 3D Mynah Bird with Yellow Beak & Wings on Buffalo's Back
    const mynah = new THREE.Group();
    mynah.position.set(-0.05, 1.22, 0);
    const birdBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    birdBody.scale.set(1.35, 0.9, 0.85);
    mynah.add(birdBody);
    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.18, 10),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.28, 0.05, 0);
    mynah.add(beak);
    buffalo.add(mynah);
    this.dioramaGroup.add(buffalo);

    // 2. Center: Branched 3D Tree Trunk + Blooming 5-Petalled Wild Orchid [+ / 0]
    const tree = new THREE.Group();
    tree.position.set(0, -1.08, 0);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.38, 1.85, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.85 })
    );
    trunk.position.y = 0.92;
    tree.add(trunk);

    const orchid = new THREE.Group();
    orchid.position.set(0.32, 0.95, 0);
    for (let p = 0; p < 5; p++) {
      const petal = this.createExtrudedLeaf(0.32, 0.11, 0xe879f9, 0.04);
      petal.rotation.z = (p / 5) * Math.PI * 2;
      orchid.add(petal);
    }
    tree.add(orchid);
    this.dioramaGroup.add(tree);

    // 3. Right: 4-Legged 3D Dog with Floppy Ears + Red Tick [+ / -]
    const dog = this.createQuadrupedMammal({
      bodyColor: 0xd97706,
      bellyColor: 0xfef3c7,
      legHeight: 0.5,
      bodyLength: 1.05,
      bodyRadius: 0.36,
      earType: "floppy",
      tailLength: 0.6
    });
    dog.scale.setScalar(0.82);
    dog.position.set(1.75, -1.08, 0);

    const tick = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xe11d48 })
    );
    tick.position.set(0.05, 1.08, 0);
    dog.add(tick);
    this.dioramaGroup.add(dog);

    this.actors.trioGroups = [buffalo, tree, dog];

    this.addPin("[+ / +] Mynah & Buffalo", "Mutualism", "#10b981", new THREE.Vector3(-1.75, 0.95, 0));
    this.addPin("[+ / 0] Orchid & Tree", "Commensalism", "#38bdf8", new THREE.Vector3(0, 1.15, 0));
    this.addPin("[+ / -] Tick & Dog", "Parasitism", "#f43f5e", new THREE.Vector3(1.75, 0.95, 0));
  }

  // ==========================================================================
  // STAGE 8: 3D ISO GREENHOUSE — CROWDED VS. SPACED SAPLINGS (- / -)
  // ==========================================================================
  buildStage8_SaplingCompetition() {
    this.createIsoBlock({ topColor: 0x334155, midColor: 0x1e293b });

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

    // Left Pot: Crowded Stunted Saplings with Leaf Blades
    const crowdedList = [];
    const paleMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.45 });
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const r = (i % 3) * 0.25 + 0.1;
      const sap = new THREE.Group();
      sap.position.set(-1.4 + Math.cos(ang) * r, -0.2, Math.sin(ang) * r);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.75, 8), paleMat);
      stem.position.y = 0.37;
      sap.add(stem);
      const leaf = this.createExtrudedLeaf(0.24, 0.08, 0xeab308, 0.04);
      leaf.position.y = 0.72;
      leaf.rotation.y = ang;
      sap.add(leaf);
      this.dioramaGroup.add(sap);
      crowdedList.push(sap);
    }
    this.actors.crowdedList = crowdedList;

    // Right Pot: 3 Spaced Lush Emerald Saplings with Multi-Leaf Crowns
    const lushMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    [-0.42, 0, 0.42].forEach((dx, idx) => {
      const dz = idx === 1 ? -0.3 : 0.22;
      const tree = new THREE.Group();
      tree.position.set(1.4 + dx, -0.2, dz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.45, 12), lushMat);
      trunk.position.y = 0.72;
      tree.add(trunk);

      for (let l = 0; l < 5; l++) {
        const leaf = this.createExtrudedLeaf(0.48, 0.16, 0x10b981, 0.08);
        leaf.position.y = 1.42;
        leaf.rotation.y = (l / 5) * Math.PI * 2;
        leaf.rotation.z = 0.25;
        tree.add(leaf);
      }
      this.dioramaGroup.add(tree);
    });

    this.addPin("Pot A (Crowded)", "- Stunted (Resource Competition)", "#f59e0b", new THREE.Vector3(-1.4, 0.95, 0));
    this.addPin("Pot B (3 Spaced)", "+ Optimal Light, Water & Space", "#10b981", new THREE.Vector3(1.4, 1.7, 0));
  }

  // ==========================================================================
  // STAGE 9: 3D ISO PLANTATION — FEATHERED OIL PALMS, BARN OWL & 4-LEGGED RAT
  // ==========================================================================
  buildStage9_BarnOwlRatEstate() {
    this.createIsoBlock({ topColor: 0x15803d, midColor: 0x78350f });

    // 2 Feathered 3D Oil Palm Trees
    [-1.75, 1.75].forEach((x) => {
      const palm = this.createFeatheredPalmTree(2.35);
      palm.scale.setScalar(0.85);
      palm.position.set(x, -1.1, -0.75);
      this.dioramaGroup.add(palm);
    });

    // Complete 4-Legged 3D Rat on Ground
    const rat = this.createQuadrupedMammal({
      bodyColor: 0x94a3b8,
      bellyColor: 0xcbd5e1,
      legHeight: 0.25,
      bodyLength: 0.7,
      bodyRadius: 0.24,
      earType: "round",
      tailLength: 0.65
    });
    rat.scale.setScalar(0.65);
    rat.position.set(0, -1.08, 0.85);
    this.dioramaGroup.add(rat);
    this.actors.rat = rat;

    // Sculpted 3D Barn Owl with Heart Facial Disc, Beak & Beveled Flapping Wings
    const owl = new THREE.Group();
    const owlWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const owlGold = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 22, 22), owlWhite);
    body.scale.set(1.3, 0.92, 0.85);
    owl.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 20), owlWhite);
    head.position.set(0.42, 0.16, 0);
    owl.add(head);

    this.createSeatedEyes(owl, 0.66, 0.2, 0.13, 0.065);

    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.16, 10),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.75, 0.12, 0);
    owl.add(beak);

    // Beveled Feathered Wings
    const leftWing = this.createExtrudedLeaf(1.15, 0.34, 0xd97706, 0.06);
    leftWing.rotation.y = -Math.PI / 2;
    leftWing.position.set(0.05, 0.1, 0.25);
    owl.add(leftWing);

    const rightWing = this.createExtrudedLeaf(1.15, 0.34, 0xd97706, 0.06);
    rightWing.rotation.y = Math.PI / 2;
    rightWing.position.set(0.05, 0.1, -0.25);
    owl.add(rightWing);

    owl.userData = { leftWing, rightWing };
    owl.position.set(0, 1.25, 0.3);
    this.dioramaGroup.add(owl);
    this.actors.owl = owl;

    this.addPin("3D Barn Owl (Predator)", "+ Natural Bio-Control", "#38bdf8", new THREE.Vector3(0, 1.9, 0.3));
    this.addPin("3D Rat Pest (Prey)", "Population Drops ↓", "#f43f5e", new THREE.Vector3(0, -0.35, 0.85));
  }

  // ==========================================================================
  // STAGE 10: 3D ISO MASTER BIOME ISLAND (SCULPTED WHALE + BARNACLES + FISH)
  // ==========================================================================
  buildStage10_IsoMasterIsland() {
    this.createIsoBlock({
      topColor: 0x10b981,
      midColor: 0x0f172a,
      waterColor: 0x0284c7,
      waterHeight: 2.8
    });

    // Sculpted 3D Blue Whale with Flippers, Horizontal Flukes & White Barnacles [+ / 0]
    const whale = new THREE.Group();
    const whaleMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.35 });

    const wBody = new THREE.Mesh(new THREE.SphereGeometry(0.75, 28, 28), whaleMat);
    wBody.scale.set(2.15, 0.85, 0.92);
    whale.add(wBody);

    const wBelly = new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 24), bellyMat);
    wBelly.scale.set(1.95, 0.6, 0.84);
    wBelly.position.y = -0.18;
    whale.add(wBelly);

    // Pectoral Flippers
    [-0.65, 0.65].forEach((z) => {
      const flip = this.createExtrudedLeaf(0.85, 0.22, 0x1d4ed8, 0.04);
      flip.position.set(0.25, -0.22, z);
      flip.rotation.y = z > 0 ? -1.15 : 1.15;
      whale.add(flip);
    });

    // Horizontal Tail Flukes
    [-1, 1].forEach((side) => {
      const fluke = this.createExtrudedLeaf(0.65, 0.2, 0x1d4ed8, 0.03);
      fluke.position.set(-1.55, 0.05, 0);
      fluke.rotation.y = side * 1.1;
      whale.add(fluke);
    });

    this.createSeatedEyes(whale, 1.05, 0.05, 0.42, 0.085);

    // White Barnacles on Whale Back
    const barnMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    [-0.2, 0.2, 0.55].forEach((bx, idx) => {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.12, 12), barnMat);
      b.position.set(bx, 0.62, (idx - 1) * 0.18);
      whale.add(b);
    });

    whale.position.set(-0.45, 0.4, -0.25);
    this.dioramaGroup.add(whale);
    this.actors.whale = whale;

    const fish = this.createClownfish3D(0.78);
    fish.position.set(1.25, 0.25, 0.85);
    this.dioramaGroup.add(fish);
    this.actors.clownfish = fish;

    this.addPin("3D Whale & Barnacles", "Commensalism [+ / 0]", "#38bdf8", new THREE.Vector3(-0.4, 1.35, -0.25));
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

    if (this.camState.autoOrbit && !this.camState.isDragging) {
      this.camState.targetTheta = 0.42 + Math.sin(t * 0.45) * 0.16;
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
        this.actors.shark.position.y = 0.72 + Math.sin(t * 2.2) * 0.09;
        if (this.actors.shark.userData.tail) {
          this.actors.shark.userData.tail.rotation.y = Math.sin(t * 6.5) * 0.28;
        }
      }
      if (this.actors.remora) {
        this.actors.remora.position.y = -0.82 + s * 0.92 + Math.sin(t * 2.2) * 0.09;
        if (this.pins[1]) this.pins[1].pos.y = this.actors.remora.position.y - 0.32;
      }
    } else if (this.currentStage === 3) {
      if (this.actors.xrayRing) {
        this.actors.xrayRing.position.y = -0.6 + s * 2.2;
      }
    } else if (this.currentStage === 4) {
      if (this.actors.rafflesia) {
        const sc = 0.52 + s * 0.56;
        this.actors.rafflesia.scale.set(sc, sc, sc);
      }
    } else if (this.currentStage === 5) {
      if (this.actors.wormSegments) {
        this.actors.wormSegments.forEach((seg, idx) => {
          seg.position.y = 0.55 + Math.sin(t * 4.5 + idx * 0.45) * (0.08 + s * 0.14);
        });
      }
    } else if (this.currentStage === 6) {
      if (this.actors.crabGroup && this.actors.octo) {
        this.actors.crabGroup.position.x = -1.35 + s * 1.2;
        this.actors.octo.position.x = 0.95 + s * 1.15;
        this.actors.octo.position.y = 0.45 + Math.sin(t * 3) * 0.14;
      }
    } else if (this.currentStage === 7) {
      if (this.actors.trioGroups) {
        const activeIdx = s < 0.34 ? 0 : s < 0.67 ? 1 : 2;
        this.actors.trioGroups.forEach((grp, idx) => {
          const targetY = idx === activeIdx ? -0.82 : -1.08;
          grp.position.y += (targetY - grp.position.y) * 0.12;
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
        owl.position.x = Math.cos(t * (1.2 + s * 1.3)) * 1.45;
        owl.position.z = Math.sin(t * (1.2 + s * 1.3)) * 1.05;
        owl.rotation.y = -t * (1.2 + s * 1.3);
        const flap = Math.sin(t * 14) * 0.42;
        owl.userData.leftWing.rotation.z = flap;
        owl.userData.rightWing.rotation.z = -flap;
        if (this.pins[0]) {
          this.pins[0].pos.x = owl.position.x;
          this.pins[0].pos.z = owl.position.z;
        }
      }
      if (this.actors.rat) {
        this.actors.rat.scale.setScalar(Math.max(0.25, 0.72 - s * 0.42));
      }
    } else if (this.currentStage === 10) {
      if (this.actors.whale) {
        this.actors.whale.position.y = 0.4 + Math.sin(t * 2) * 0.08;
      }
      if (this.actors.clownfish) {
        this.actors.clownfish.position.y = 0.25 + Math.cos(t * 3) * 0.08;
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
