// ============================================================================
// ECOQUEST: INTERACTION AMONG LIVING THINGS (KSSR YEAR 6 SCIENCE - UNIT 4)
// Custom Question Bank, SVG Biological Illustrations, Diagnostic Feedback,
// and Classroom Misconception Dataset for HPGD3203 Prototype
// ============================================================================

const QUESTION_BANK = [
  {
    id: 1,
    code: "Q1-MUT-CORAL",
    type: "visual-mcq",
    category: "Symbiosis: Mutualism (+ / +)",
    difficulty: "Foundation",
    bloomLevel: "Understand & Classify",
    title: "Coral Reef Partners: Clownfish & Sea Anemone",
    scenario: "During a marine biology dive at Pulau Redang, Terengganu, you observe an orange clownfish living safely among the stinging tentacles of a sea anemone.",
    question: "How does this interaction classify as Mutualism (+ / +) for BOTH living things?",
    audioScript: "Field Observation One. At Pulau Redang coral reef, a clownfish swims safely among the stinging tentacles of a sea anemone. Why is this relationship classified as mutualism where both organisms benefit?",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of Clownfish and Sea Anemone mutualism">
      <defs>
        <linearGradient id="seaGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#064e6e"/>
          <stop offset="100%" stop-color="#04293a"/>
        </linearGradient>
      </defs>
      <rect width="520" height="240" rx="14" fill="url(#seaGrad1)"/>
      <!-- Bubbles -->
      <circle cx="60" cy="50" r="6" fill="#38bdf8" opacity="0.35"/>
      <circle cx="75" cy="30" r="4" fill="#38bdf8" opacity="0.45"/>
      <circle cx="450" cy="60" r="7" fill="#38bdf8" opacity="0.3"/>
      <!-- Reef rock base -->
      <path d="M90 240 Q260 190 430 240 Z" fill="#334155"/>
      <!-- Sea Anemone base & tentacles -->
      <path d="M180 220 C175 180 205 170 260 170 C315 170 345 180 340 220 Z" fill="#be185d"/>
      <g stroke="#f472b6" stroke-width="9" stroke-linecap="round" fill="none">
        <path d="M195 175 Q170 120 185 95"/>
        <path d="M215 172 Q200 110 215 80"/>
        <path d="M240 170 Q235 105 245 75"/>
        <path d="M265 170 Q268 100 278 78"/>
        <path d="M290 172 Q305 110 298 82"/>
        <path d="M312 175 Q335 120 325 90"/>
        <path d="M330 182 Q360 135 348 108"/>
      </g>
      <!-- Glowing tips -->
      <g fill="#fde047">
        <circle cx="185" cy="95" r="5"/><circle cx="215" cy="80" r="5"/>
        <circle cx="245" cy="75" r="5"/><circle cx="278" cy="78" r="5"/>
        <circle cx="298" cy="82" r="5"/><circle cx="325" cy="90" r="5"/>
        <circle cx="348" cy="108" r="5"/>
      </g>
      <!-- Clownfish -->
      <g transform="translate(230, 105)">
        <ellipse cx="35" cy="22" rx="34" ry="18" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
        <polygon points="65,22 84,8 84,36" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
        <!-- White stripes -->
        <path d="M18 7 Q22 22 18 37" stroke="#ffffff" stroke-width="6" fill="none"/>
        <path d="M40 5 Q44 22 40 39" stroke="#ffffff" stroke-width="6" fill="none"/>
        <circle cx="12" cy="18" r="3.5" fill="#0f172a"/>
      </g>
      <!-- Ecological Exchange Labels -->
      <rect x="16" y="18" width="155" height="58" rx="8" fill="#0f172a" opacity="0.85" stroke="#22c55e" stroke-width="1.5"/>
      <text x="26" y="38" fill="#4ade80" font-family="sans-serif" font-size="12" font-weight="bold">Clownfish (+ Benefit)</text>
      <text x="26" y="54" fill="#e2e8f0" font-family="sans-serif" font-size="11">Protected from predators</text>
      <text x="26" y="68" fill="#e2e8f0" font-family="sans-serif" font-size="11">&amp; eats food scraps</text>

      <rect x="335" y="18" width="170" height="58" rx="8" fill="#0f172a" opacity="0.85" stroke="#22c55e" stroke-width="1.5"/>
      <text x="345" y="38" fill="#4ade80" font-family="sans-serif" font-size="12" font-weight="bold">Sea Anemone (+ Benefit)</text>
      <text x="345" y="54" fill="#e2e8f0" font-family="sans-serif" font-size="11">Cleaned of parasites &amp;</text>
      <text x="345" y="68" fill="#e2e8f0" font-family="sans-serif" font-size="11">lures prey closer</text>
    </svg>`,
    clue: "Look at the ecological symbols: In Mutualism (+ / +), Organism A gains a survival advantage AND Organism B also gains a survival advantage.",
    options: [
      {
        id: "A",
        text: "The clownfish gets shelter from predators, while the sea anemone gets cleaned and attracts prey (+ / +).",
        isCorrect: true,
        feedback: "Spot on! Both organisms benefit (+ / +): the mucus-coated clownfish hides safely inside the stinging tentacles, while chasing away butterflyfish predators and providing nutrients to the sea anemone."
      },
      {
        id: "B",
        text: "The clownfish gets shelter, while the sea anemone is neither helped nor harmed (+ / 0).",
        isCorrect: false,
        misconceptionTag: "Confusing Mutualism with Commensalism",
        feedback: "Not quite! You described Commensalism (+ / 0). Remember that the sea anemone is NOT neutral here—it actively benefits (+ / +) because the clownfish cleans its tentacles, circulates water, and scares away anemone-eating fish!"
      },
      {
        id: "C",
        text: "The clownfish feeds on the sea anemone's tentacles, slowly weakening the anemone (+ / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Mutualism with Parasitism",
        feedback: "Careful! That would be Parasitism (+ / -). Clownfish do not eat healthy sea anemone tentacles; instead, they protect the anemone and keep it clean so both thrive together (+ / +)."
      },
      {
        id: "D",
        text: "The sea anemone stings and digests the clownfish as its primary food source (Prey-Predator).",
        isCorrect: false,
        misconceptionTag: "Confusing Symbiosis with Prey-Predator",
        feedback: "Look closely at the clownfish's skin! Clownfish have a special mucus layer that prevents the anemone from stinging them. Instead of hunting each other, they form a long-term Mutualism (+ / +) partnership."
      }
    ],
    classStats: { accuracy: 84, distractorCounts: { A: 27, B: 3, C: 1, D: 1 } }
  },
  {
    id: 2,
    code: "Q2-COM-REMORA",
    type: "visual-mcq",
    category: "Symbiosis: Commensalism (+ / 0)",
    difficulty: "Core Concept (High Misconception)",
    bloomLevel: "Analyse & Differentiate",
    title: "Ocean Hitchhiker: Remora Fish & Shark",
    scenario: "A remora fish (ikan gemi) uses a modified suction disc on top of its head to attach itself to the belly of a shark swimming in the South China Sea.",
    question: "Why do scientists classify the Remora and Shark relationship as Commensalism (+ / 0) instead of Mutualism or Parasitism?",
    audioScript: "Field Observation Two. A remora fish attaches to a shark's belly using a dorsal suction disc. Why is this classified as commensalism rather than mutualism or parasitism?",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of Shark and Remora fish commensalism">
      <rect width="520" height="240" rx="14" fill="#0c4a6e"/>
      <!-- Water rays -->
      <polygon points="80,0 140,0 200,240 110,240" fill="#38bdf8" opacity="0.08"/>
      <polygon points="280,0 350,0 410,240 310,240" fill="#38bdf8" opacity="0.08"/>
      <!-- Shark body -->
      <path d="M70 115 Q190 60 340 95 L430 55 L405 115 L430 165 L340 135 Q190 155 70 115 Z" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
      <!-- Shark dorsal fin -->
      <path d="M210 82 L245 28 L275 84 Z" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
      <!-- Shark belly white -->
      <path d="M90 120 Q210 150 340 130 Q210 135 90 120 Z" fill="#f1f5f9"/>
      <!-- Shark eye & gills -->
      <circle cx="110" cy="105" r="4.5" fill="#0f172a"/>
      <line x1="155" y1="98" x2="152" y2="122" stroke="#1e293b" stroke-width="2.5"/>
      <line x1="165" y1="98" x2="162" y2="122" stroke="#1e293b" stroke-width="2.5"/>
      <line x1="175" y1="98" x2="172" y2="122" stroke="#1e293b" stroke-width="2.5"/>
      <!-- Remora attached underneath -->
      <g transform="translate(200, 142)">
        <ellipse cx="45" cy="12" rx="38" ry="9" fill="#0284c7" stroke="#bae6fd" stroke-width="1.5"/>
        <polygon points="80,12 96,4 96,20" fill="#0284c7"/>
        <rect x="20" y="1" width="28" height="4" rx="2" fill="#facc15"/>
        <circle cx="18" cy="11" r="2.5" fill="#ffffff"/>
      </g>
      <!-- Floating food scraps -->
      <circle cx="75" cy="145" r="3.5" fill="#fbbf24"/>
      <circle cx="95" cy="155" r="4" fill="#fbbf24"/>
      <circle cx="120" cy="148" r="3" fill="#fbbf24"/>
      <!-- Info Badges -->
      <rect x="20" y="18" width="215" height="44" rx="8" fill="#0f172a" opacity="0.88" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="32" y="37" fill="#cbd5e1" font-family="sans-serif" font-size="12" font-weight="bold">Shark: (0 Neutral Effect)</text>
      <text x="32" y="53" fill="#94a3b8" font-family="sans-serif" font-size="11">Not harmed &amp; gains no food benefit</text>

      <rect x="255" y="175" width="245" height="48" rx="8" fill="#0f172a" opacity="0.88" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="267" y="194" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold">Remora: (+ Benefits Greatly)</text>
      <text x="267" y="211" fill="#e2e8f0" font-family="sans-serif" font-size="11">Free transport, protection &amp; food scraps</text>
    </svg>`,
    clue: "Ask two questions: (1) Does the remora benefit? (2) Does the shark lose blood/nutrients or gain a survival advantage from the scraps falling from its mouth?",
    options: [
      {
        id: "A",
        text: "Both benefit equally because the remora hunts fish to feed the shark (+ / +).",
        isCorrect: false,
        misconceptionTag: "Misconception: Remora feeds or helps the shark (False Mutualism)",
        feedback: "Common misconception alert! The remora does NOT hunt food for the shark. Instead, the remora eats tiny leftover scraps that float away when the shark eats. Since the shark neither gains nor loses anything (0), this is Commensalism (+ / 0)."
      },
      {
        id: "B",
        text: "The remora gains free transport, protection, and food scraps (+), while the shark is neither harmed nor benefited (0).",
        isCorrect: true,
        feedback: "Excellent analysis! In Commensalism (+ / 0), the remora gains transport, protection from predators, and leftover food scraps (+), while the large shark is completely unaffected (0)."
      },
      {
        id: "C",
        text: "The remora sucks blood from the shark's belly through its head disc, weakening the shark (+ / -).",
        isCorrect: false,
        misconceptionTag: "Misconception: Suction disc sucks blood like a parasite",
        feedback: "Look closely at the remora's suction disc! Unlike a sea lamprey or leech, a remora's dorsal fin disc only holds onto the shark's skin for a free ride without piercing flesh or sucking blood. The shark is unharmed (0)!"
      },
      {
        id: "D",
        text: "The shark and remora compete aggressively for the same large prey in the ocean (- / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Commensalism with Competition",
        feedback: "Not quite! Sharks hunt large fish, while the tiny remora simply catches leftover crumbs drifting away after the shark eats. There is no competition because the shark doesn't eat those tiny scraps."
      }
    ],
    classStats: { accuracy: 53, distractorCounts: { A: 11, B: 17, C: 3, D: 1 } }
  },
  {
    id: 3,
    code: "Q3-COM-EPIPHYTE",
    type: "visual-mcq",
    category: "Symbiosis: Plant Commensalism (+ / 0)",
    difficulty: "High Misconception Spotter",
    bloomLevel: "Evaluate & Distinguish",
    title: "Rainforest Canopy: Bird's Nest Fern on an Oil Palm Trunk",
    scenario: "In a Malaysian oil palm plantation, you notice green Bird's Nest Ferns (Paku Langsuyar) growing high up in the crevices of an oil palm tree trunk.",
    question: "Many students mistakenly call the Bird's Nest Fern a parasite. Why is it actually Commensalism (+ / 0)?",
    audioScript: "Field Observation Three. Green Bird's Nest Ferns grow high on an oil palm trunk. Why is this relationship actually commensalism and not parasitism?",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of Bird's Nest Fern growing on an Oil Palm tree trunk">
      <rect width="520" height="240" rx="14" fill="#14532d"/>
      <!-- Sun -->
      <circle cx="450" cy="48" r="28" fill="#facc15"/>
      <g stroke="#fde047" stroke-width="3" stroke-dasharray="5,5">
        <line x1="420" y1="60" x2="305" y2="110"/>
        <line x1="430" y1="75" x2="320" y2="130"/>
      </g>
      <!-- Host Tree Trunk -->
      <path d="M180 240 L195 0 L275 0 L290 240 Z" fill="#78350f" stroke="#451a03" stroke-width="3"/>
      <!-- Bark texture -->
      <line x1="215" y1="20" x2="210" y2="220" stroke="#451a03" stroke-width="2" stroke-dasharray="12,8"/>
      <line x1="250" y1="35" x2="255" y2="230" stroke="#451a03" stroke-width="2" stroke-dasharray="15,10"/>
      <!-- Bird's Nest Fern attached to outside of bark -->
      <g transform="translate(260, 125)">
        <!-- Spongy root mass on surface only -->
        <ellipse cx="15" cy="25" rx="22" ry="14" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>
        <!-- Green fronds for photosynthesis -->
        <path d="M10 18 Q-10 -25 5 -45 Q20 -20 18 18 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
        <path d="M18 18 Q25 -30 48 -42 Q40 -10 24 18 Z" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
        <path d="M22 22 Q45 -10 72 -12 Q50 15 25 24 Z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
        <path d="M8 22 Q-25 -5 -35 10 Q-10 22 10 24 Z" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
      </g>
      <!-- Callout Labels -->
      <rect x="16" y="30" width="155" height="72" rx="8" fill="#0f172a" opacity="0.9" stroke="#eab308" stroke-width="1.5"/>
      <text x="26" y="50" fill="#facc15" font-family="sans-serif" font-size="12" font-weight="bold">Oil Palm Tree (0)</text>
      <text x="26" y="68" fill="#e2e8f0" font-family="sans-serif" font-size="11">Roots do NOT pierce</text>
      <text x="26" y="84" fill="#e2e8f0" font-family="sans-serif" font-size="11">phloem/xylem tissues!</text>

      <rect x="295" y="158" width="210" height="66" rx="8" fill="#0f172a" opacity="0.9" stroke="#4ade80" stroke-width="1.5"/>
      <text x="307" y="178" fill="#4ade80" font-family="sans-serif" font-size="12" font-weight="bold">Bird's Nest Fern (+)</text>
      <text x="307" y="195" fill="#e2e8f0" font-family="sans-serif" font-size="11">Gains height for sunlight &amp;</text>
      <text x="307" y="211" fill="#e2e8f0" font-family="sans-serif" font-size="11">makes own food (Photosynthesis)</text>
    </svg>`,
    clue: "Notice the bright green leaves of the Bird's Nest Fern! Does it steal sap from inside the tree, or does it only rest on the outer bark to reach sunlight?",
    options: [
      {
        id: "A",
        text: "The fern's roots drill deep into the oil palm's stem to steal water and glucose (+ / -).",
        isCorrect: false,
        misconceptionTag: "Misconception: All plants growing on trees are parasites",
        feedback: "Watch out for this classic trap! Plants like Mistletoe (Dedalu) drill into tree stems (Parasitism), but the Bird's Nest Fern is an epiphyte—its roots only cling to the outer bark surface without stealing sap!"
      },
      {
        id: "B",
        text: "The fern clings to the outer bark to reach sunlight and makes its own food via photosynthesis (+), without harming the tree (0).",
        isCorrect: true,
        feedback: "Brilliant scientific reasoning! The Bird's Nest Fern has chlorophyll and traps rainwater and fallen leaves in its nest-shaped base to make its own food (+), while the oil palm trunk simply provides physical support and is unharmed (0)."
      },
      {
        id: "C",
        text: "The fern supplies extra glucose to the oil palm tree during the dry season (+ / +).",
        isCorrect: false,
        misconceptionTag: "Confusing Epiphyte Commensalism with Mutualism",
        feedback: "Not quite! The Bird's Nest Fern keeps the glucose it produces for its own growth; its roots are not connected to the oil palm's internal transport system, so the oil palm receives neither benefit nor harm (0)."
      },
      {
        id: "D",
        text: "The oil palm tree shades out the fern to stop it from growing (- / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Epiphyte Support with Competition",
        feedback: "Actually, by perching high on the oil palm trunk, the Bird's Nest Fern escapes the dark forest floor and gains better access to sunlight (+) without competing with the tall oil palm crown."
      }
    ],
    classStats: { accuracy: 47, distractorCounts: { A: 14, B: 15, C: 2, D: 1 } }
  },
  {
    id: 4,
    code: "Q4-PAR-RAFFLESIA",
    type: "visual-mcq",
    category: "Symbiosis: Parasitism (+ / -)",
    difficulty: "Core Concept",
    bloomLevel: "Analyse",
    title: "Jungle Giant: Rafflesia & Tetrastigma Vine",
    scenario: "Deep in Taman Negara, you find a giant blooming Rafflesia flower attached to the woody roots of a Tetrastigma vine. The Rafflesia has no leaves, no stem, and no chlorophyll!",
    question: "How does the Rafflesia survive, and what type of interaction does it have with the host vine?",
    audioScript: "Field Observation Four. In Taman Negara, a giant Rafflesia blooms on a Tetrastigma vine. It has no green leaves and cannot photosynthesize. What interaction is this?",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of Rafflesia parasitism on Tetrastigma host vine">
      <rect width="520" height="240" rx="14" fill="#27171c"/>
      <!-- Forest floor -->
      <rect x="0" y="175" width="520" height="65" rx="6" fill="#3f2314"/>
      <!-- Host Tetrastigma Vine Root -->
      <path d="M30 165 Q160 140 270 165 Q390 185 490 155" stroke="#78350f" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M30 165 Q160 140 270 165 Q390 185 490 155" stroke="#a16207" stroke-width="6" fill="none" stroke-dasharray="10,8"/>
      <!-- Haustoria nutrient theft arrows -->
      <path d="M235 162 L255 128" stroke="#ef4444" stroke-width="3" stroke-dasharray="4,3"/>
      <path d="M285 164 L268 128" stroke="#ef4444" stroke-width="3" stroke-dasharray="4,3"/>
      <!-- Rafflesia 5-petaled flower -->
      <g transform="translate(260, 108)">
        <ellipse cx="0" cy="-48" rx="32" ry="26" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
        <ellipse cx="-48" cy="-12" rx="30" ry="24" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
        <ellipse cx="48" cy="-12" rx="30" ry="24" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
        <ellipse cx="-32" cy="34" rx="28" ry="22" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2"/>
        <ellipse cx="32" cy="34" rx="28" ry="22" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2"/>
        <!-- White spots -->
        <circle cx="-10" cy="-52" r="4" fill="#fef2f2"/><circle cx="12" cy="-45" r="3.5" fill="#fef2f2"/>
        <circle cx="-52" cy="-15" r="4" fill="#fef2f2"/><circle cx="48" cy="-16" r="4" fill="#fef2f2"/>
        <circle cx="-35" cy="35" r="3.5" fill="#fef2f2"/><circle cx="35" cy="35" r="3.5" fill="#fef2f2"/>
        <!-- Central diaphragm -->
        <circle cx="0" cy="0" r="26" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
        <circle cx="0" cy="0" r="18" fill="#450a0a"/>
      </g>
      <!-- Labels -->
      <rect x="16" y="18" width="175" height="62" rx="8" fill="#0f172a" opacity="0.9" stroke="#ef4444" stroke-width="1.5"/>
      <text x="26" y="38" fill="#f87171" font-family="sans-serif" font-size="12" font-weight="bold">Rafflesia (+ Parasite)</text>
      <text x="26" y="54" fill="#e2e8f0" font-family="sans-serif" font-size="11">No leaves/chlorophyll;</text>
      <text x="26" y="69" fill="#e2e8f0" font-family="sans-serif" font-size="11">absorbs host nutrients</text>

      <rect x="330" y="18" width="175" height="62" rx="8" fill="#0f172a" opacity="0.9" stroke="#fb923c" stroke-width="1.5"/>
      <text x="340" y="38" fill="#fb923c" font-family="sans-serif" font-size="12" font-weight="bold">Tetrastigma Vine (- Host)</text>
      <text x="340" y="54" fill="#e2e8f0" font-family="sans-serif" font-size="11">Harmed as water &amp; food</text>
      <text x="340" y="69" fill="#e2e8f0" font-family="sans-serif" font-size="11">are drained away</text>
    </svg>`,
    clue: "Since the Rafflesia has zero chlorophyll to carry out photosynthesis, where must its water and sugar come from, and how does that affect the vine?",
    options: [
      {
        id: "A",
        text: "Commensalism (+ / 0) — It rests harmlessly on the vine root to attract flies.",
        isCorrect: false,
        misconceptionTag: "Confusing Parasitic Rafflesia with Epiphytes",
        feedback: "Remember: Unlike the green Bird's Nest Fern, the Rafflesia has NO green leaves to make its own food! It must penetrate the vine's tissue and drain its nutrients, which harms the host (-)."
      },
      {
        id: "B",
        text: "Parasitism (+ / -) — The Rafflesia absorbs water and nutrients directly from the host vine (+), weakening the vine (-).",
        isCorrect: true,
        feedback: "Spot on! Rafflesia is a holoparasite (+ / -). It sends thread-like filaments inside the Tetrastigma vine to absorb water and nutrients (+), leaving the host vine nutrient-deprived (-)."
      },
      {
        id: "C",
        text: "Mutualism (+ / +) — The Rafflesia gives minerals to the vine in exchange for sugar.",
        isCorrect: false,
        misconceptionTag: "Confusing Parasitism with Fungal Mycorrhiza Mutualism",
        feedback: "Not quite! The Rafflesia has no roots in the soil to gather minerals for the vine—it lives entirely inside the host vine and only takes nutrients (+ / -)."
      },
      {
        id: "D",
        text: "Prey-Predator — The Rafflesia traps and digests insects like a pitcher plant.",
        isCorrect: false,
        misconceptionTag: "Confusing Rafflesia Pollination with Carnivorous Plants",
        feedback: "Good try, but Rafflesia is not a carnivorous plant! It smells like rotting meat only to trick carrion flies into pollinating its flowers; its food comes from parasitizing the Tetrastigma vine (+ / -)."
      }
    ],
    classStats: { accuracy: 78, distractorCounts: { A: 4, B: 25, C: 1, D: 2 } }
  },
  {
    id: 5,
    code: "Q5-PAR-TAPEWORM",
    type: "visual-mcq",
    category: "Symbiosis: Animal Parasitism (+ / -)",
    difficulty: "Foundation",
    bloomLevel: "Understand & Explain",
    title: "Veterinary Case: Cat & Fleas / Tapeworms",
    scenario: "A stray cat taken to a veterinary clinic is found to be very thin and weak despite eating plenty of food. The vet discovers tapeworms living inside the cat's small intestine.",
    question: "In this Parasitism (+ / -) relationship, identify the Parasite (+) and the Host (-), and explain why the cat is losing weight.",
    audioScript: "Field Observation Five. A cat is weak and losing weight even though it eats well. The veterinarian finds tapeworms inside its intestine. Identify the parasite, the host, and the reason for weight loss.",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of Endoparasite tapeworm absorbing nutrients in host intestine">
      <rect width="520" height="240" rx="14" fill="#1e1b4b"/>
      <!-- Left Card: Host Cat -->
      <rect x="25" y="25" width="205" height="190" rx="12" fill="#312e81" stroke="#f87171" stroke-width="2"/>
      <text x="45" y="52" fill="#fca5a5" font-family="sans-serif" font-size="14" font-weight="bold">HOST (- Harmed): Cat</text>
      <!-- Stylized Cat Silhouette -->
      <circle cx="125" cy="110" r="32" fill="#fb923c"/>
      <polygon points="98,88 104,64 120,82" fill="#fb923c"/>
      <polygon points="152,88 146,64 130,82" fill="#fb923c"/>
      <circle cx="114" cy="106" r="4" fill="#0f172a"/>
      <circle cx="136" cy="106" r="4" fill="#0f172a"/>
      <path d="M118 122 Q125 116 132 122" stroke="#0f172a" stroke-width="2.5" fill="none"/>
      <text x="42" y="168" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Loses digested nutrients</text>
      <text x="42" y="188" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Suffers malnutrition &amp; fatigue</text>

      <!-- Arrow -->
      <path d="M240 120 L280 120" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow)"/>
      <text x="236" y="105" fill="#fda4af" font-family="sans-serif" font-size="11" font-weight="bold">Nutrient Theft</text>

      <!-- Right Card: Tapeworm Parasite -->
      <rect x="290" y="25" width="205" height="190" rx="12" fill="#312e81" stroke="#4ade80" stroke-width="2"/>
      <text x="305" y="52" fill="#4ade80" font-family="sans-serif" font-size="14" font-weight="bold">PARASITE (+): Tapeworm</text>
      <!-- Segmented worm illustration -->
      <path d="M330 115 Q360 85 390 115 T450 115" stroke="#fef08a" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="10,3"/>
      <circle cx="330" cy="115" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <text x="305" y="168" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Lives in small intestine</text>
      <text x="305" y="188" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Absorbs digested food (+)</text>
    </svg>`,
    clue: "In Parasitism (+ / -), the organism that steals nutrients is the Parasite (+), and the organism that suffers harm is the Host (-).",
    options: [
      {
        id: "A",
        text: "Parasite: Tapeworm (+); Host: Cat (-). The tapeworm absorbs digested nutrients inside the cat's intestine, depriving the cat.",
        isCorrect: true,
        feedback: "Well done! The tapeworm is the internal parasite (+) that absorbs ready-digested food in the small intestine, while the cat is the host (-) suffering nutrient deficiency."
      },
      {
        id: "B",
        text: "Parasite: Cat (+); Host: Tapeworm (-). The cat digests the tapeworm for extra protein.",
        isCorrect: false,
        misconceptionTag: "Reversing Parasite and Host Roles",
        feedback: "Oops, you swapped the roles! The larger animal being harmed is the Host (the cat, -), and the smaller organism living inside it and taking nutrients is the Parasite (the tapeworm, +)."
      },
      {
        id: "C",
        text: "Both are hosts in a Commensalism (+ / 0) relationship because the tapeworm only eats undigested waste.",
        isCorrect: false,
        misconceptionTag: "Misconception: Internal parasites only eat harmless waste",
        feedback: "Careful! Tapeworms do NOT eat harmless waste—they live in the small intestine where they absorb vital glucose, vitamins, and amino acids meant for the cat, actively harming the host (-)."
      },
      {
        id: "D",
        text: "The tapeworm helps the cat digest tough meat in a Mutualism (+ / +) partnership.",
        isCorrect: false,
        misconceptionTag: "Confusing Tapeworms with Beneficial Gut Bacteria",
        feedback: "Don't confuse tapeworms with helpful gut bacteria! Tapeworms are parasites (+ / -) that steal nutrients and make the cat sick and malnourished."
      }
    ],
    classStats: { accuracy: 88, distractorCounts: { A: 28, B: 2, C: 1, D: 1 } }
  },
  {
    id: 6,
    code: "Q6-MUT-HERMIT",
    type: "visual-mcq",
    category: "Symbiosis: Mutualism (+ / +)",
    difficulty: "Application",
    bloomLevel: "Apply",
    title: "Coastal Armor: Hermit Crab & Sea Anemone",
    scenario: "Along the rocky tide pools of Port Dickson, a hermit crab (umang-umang) carries a sea anemone on top of its borrowed snail shell. When the crab moves to a bigger shell, it gently transfers the sea anemone onto the new shell!",
    question: "Why does the hermit crab go to the trouble of moving the sea anemone to its new shell?",
    audioScript: "Field Observation Six. A hermit crab carries a sea anemone on its shell and even moves it onto a new shell when changing shells. Why do both animals benefit from this behaviour?",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of Hermit Crab and Sea Anemone mutualism">
      <rect width="520" height="240" rx="14" fill="#0f172a"/>
      <!-- Sandy seabed -->
      <path d="M0 190 Q260 170 520 195 L520 240 L0 240 Z" fill="#d97706"/>
      <!-- Sea Anemone on top of shell -->
      <path d="M235 112 L225 78 L275 78 L265 112 Z" fill="#db2777"/>
      <g stroke="#f472b6" stroke-width="6" stroke-linecap="round">
        <line x1="230" y1="78" x2="215" y2="48"/>
        <line x1="242" y1="78" x2="238" y2="42"/>
        <line x1="255" y1="78" x2="260" y2="42"/>
        <line x1="268" y1="78" x2="282" y2="50"/>
      </g>
      <!-- Snail shell carried by crab -->
      <ellipse cx="265" cy="145" rx="52" ry="38" fill="#b45309" stroke="#78350f" stroke-width="3"/>
      <path d="M250 145 A18 18 0 1 1 285 145 A10 10 0 1 1 265 145" stroke="#fef3c7" stroke-width="3" fill="none"/>
      <!-- Hermit Crab claws & legs -->
      <g stroke="#dc2626" stroke-width="6" stroke-linecap="round" fill="none">
        <path d="M215 160 L185 185"/>
        <path d="M230 172 L210 198"/>
        <path d="M250 178 L242 202"/>
      </g>
      <!-- Big red claw -->
      <ellipse cx="172" cy="155" rx="22" ry="14" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <circle cx="202" cy="138" r="5" fill="#1e293b" stroke="#ffffff" stroke-width="2"/>
      <!-- Labels -->
      <rect x="16" y="22" width="180" height="62" rx="8" fill="#1e293b" stroke="#4ade80" stroke-width="1.5"/>
      <text x="26" y="42" fill="#4ade80" font-family="sans-serif" font-size="12" font-weight="bold">Hermit Crab (+)</text>
      <text x="26" y="58" fill="#e2e8f0" font-family="sans-serif" font-size="11">Anemone's stinging cells</text>
      <text x="26" y="73" fill="#e2e8f0" font-family="sans-serif" font-size="11">scare off octopuses &amp; fish</text>

      <rect x="315" y="22" width="188" height="62" rx="8" fill="#1e293b" stroke="#4ade80" stroke-width="1.5"/>
      <text x="325" y="42" fill="#4ade80" font-family="sans-serif" font-size="12" font-weight="bold">Sea Anemone (+)</text>
      <text x="325" y="58" fill="#e2e8f0" font-family="sans-serif" font-size="11">Gains mobility to reach</text>
      <text x="325" y="73" fill="#e2e8f0" font-family="sans-serif" font-size="11">more food &amp; crab's scraps</text>
    </svg>`,
    clue: "A sea anemone is normally stuck on one rock, while a hermit crab is hunted by octopuses. How do they solve each other's problems?",
    options: [
      {
        id: "A",
        text: "Because in this Mutualism (+ / +), the anemone's stinging tentacles protect the crab from predators, while the crab carries the anemone to new feeding grounds.",
        isCorrect: true,
        feedback: "Fantastic! Both partners win (+ / +): the hermit crab gets a living shield of stinging tentacles against octopuses, and the normally stationary sea anemone gets free transport to food-rich areas!"
      },
      {
        id: "B",
        text: "Because the hermit crab is a parasite (+ / -) that slowly eats the sea anemone's base when hungry.",
        isCorrect: false,
        misconceptionTag: "Misinterpreting Active Transfer as Predation/Parasitism",
        feedback: "Think about the scenario: the crab carefully transfers the anemone to keep it alive on its new shell! The crab values the anemone's stinging protection, while the anemone gets transport and food scraps (+ / +)."
      },
      {
        id: "C",
        text: "Because in Commensalism (+ / 0), only the crab benefits while the sea anemone gets nothing from moving around.",
        isCorrect: false,
        misconceptionTag: "Overlooking Mobility Benefit to Sessile Sea Anemone",
        feedback: "Remember that sea anemones are usually stuck in one spot! By riding on the hermit crab's shell, the anemone reaches wider feeding areas and catches food scraps shredded by the crab's claws (+ / +)."
      },
      {
        id: "D",
        text: "Because they are competing for the empty snail shell (- / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Habitat Sharing with Competition",
        feedback: "They don't compete for the same space! The hermit crab lives *inside* the shell, while the sea anemone attaches to the *outside* surface of the shell—working together in Mutualism (+ / +)."
      }
    ],
    classStats: { accuracy: 72, distractorCounts: { A: 23, B: 2, C: 6, D: 1 } }
  },
  {
    id: 7,
    code: "Q7-MATRIX-SYMBIOSIS",
    type: "matrix-lab",
    category: "Symbiosis Diagnostic Matrix (+ / 0 / -)",
    difficulty: "Higher-Order Synthesis",
    bloomLevel: "Evaluate & Synthesize",
    title: "Eco-Lab Diagnostic: Decode the Symbiosis Code!",
    scenario: "In the EcoQuest Bio-Lab, scientists use Ecological Outcome Codes: [ + / + ], [ + / 0 ], and [ + / - ] to classify how two species affect each other.",
    question: "Which row in the Eco-Lab table below correctly matches ALL THREE interaction types, outcome codes, and Malaysian organism pairs?",
    audioScript: "Field Observation Seven. Eco-Lab Diagnostic Matrix. Match all three ecological outcome codes—plus-plus, plus-zero, and plus-minus—with their correct interaction names and Malaysian species examples.",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Symbiosis Ecological Code Matrix Diagram">
      <rect width="520" height="240" rx="14" fill="#0f172a"/>
      <!-- 3 Columns -->
      <g transform="translate(20, 22)">
        <rect width="150" height="195" rx="10" fill="#064e3b" stroke="#22c55e" stroke-width="2"/>
        <circle cx="75" cy="45" r="24" fill="#22c55e" opacity="0.2"/>
        <text x="75" y="52" text-anchor="middle" fill="#4ade80" font-family="sans-serif" font-size="20" font-weight="bold">[ + / + ]</text>
        <text x="75" y="88" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">MUTUALISM</text>
        <text x="75" y="115" text-anchor="middle" fill="#a7f3d0" font-family="sans-serif" font-size="11">Species A: Benefits (+)</text>
        <text x="75" y="135" text-anchor="middle" fill="#a7f3d0" font-family="sans-serif" font-size="11">Species B: Benefits (+)</text>
        <text x="75" y="168" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="11" font-weight="bold">Mynah Bird &amp; Buffalo</text>
      </g>
      <g transform="translate(185, 22)">
        <rect width="150" height="195" rx="10" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="75" cy="45" r="24" fill="#38bdf8" opacity="0.2"/>
        <text x="75" y="52" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="20" font-weight="bold">[ + / 0 ]</text>
        <text x="75" y="88" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">COMMENSALISM</text>
        <text x="75" y="115" text-anchor="middle" fill="#bae6fd" font-family="sans-serif" font-size="11">Species A: Benefits (+)</text>
        <text x="75" y="135" text-anchor="middle" fill="#bae6fd" font-family="sans-serif" font-size="11">Species B: Neutral (0)</text>
        <text x="75" y="168" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="11" font-weight="bold">Orchid on Forest Tree</text>
      </g>
      <g transform="translate(350, 22)">
        <rect width="150" height="195" rx="10" fill="#450a0a" stroke="#f87171" stroke-width="2"/>
        <circle cx="75" cy="45" r="24" fill="#f87171" opacity="0.2"/>
        <text x="75" y="52" text-anchor="middle" fill="#f87171" font-family="sans-serif" font-size="20" font-weight="bold">[ + / - ]</text>
        <text x="75" y="88" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">PARASITISM</text>
        <text x="75" y="115" text-anchor="middle" fill="#fecaca" font-family="sans-serif" font-size="11">Species A: Benefits (+)</text>
        <text x="75" y="135" text-anchor="middle" fill="#fecaca" font-family="sans-serif" font-size="11">Species B: Harmed (-)</text>
        <text x="75" y="168" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="11" font-weight="bold">Tick on a Dog</text>
      </g>
    </svg>`,
    clue: "Check each pair carefully: Mynah birds eat ticks off buffaloes (+ / +); Wild orchids perch on tree bark for sunlight (+ / 0); Ticks suck blood from dogs (+ / -).",
    options: [
      {
        id: "A",
        text: "Mutualism [+ / +]: Mynah & Buffalo | Commensalism [+ / 0]: Wild Orchid & Tree | Parasitism [+ / -]: Tick & Dog",
        isCorrect: true,
        feedback: "Master Eco-Scientist! Mynah birds get food while buffaloes get rid of ticks [+ / +]; wild orchids get sunlight on tree bark without harming the tree [+ / 0]; and ticks suck blood from dogs [+ / -]."
      },
      {
        id: "B",
        text: "Mutualism [+ / 0]: Remora & Shark | Commensalism [+ / +]: Mynah & Buffalo | Parasitism [+ / -]: Rafflesia & Vine",
        isCorrect: false,
        misconceptionTag: "Swapping Mutualism [+ / +] and Commensalism [+ / 0] definitions",
        feedback: "Look closely at the symbols! You swapped Mutualism and Commensalism. Remember: Mutualism means MUTUAL benefit [+ / +], whereas Commensalism has one neutral partner [+ / 0]."
      },
      {
        id: "C",
        text: "Mutualism [+ / +]: Mynah & Buffalo | Commensalism [+ / 0]: Rafflesia & Vine | Parasitism [+ / -]: Wild Orchid & Tree",
        isCorrect: false,
        misconceptionTag: "Swapping Epiphytes (Orchid) and Parasites (Rafflesia)",
        feedback: "Careful with plant interactions! Wild orchids have green leaves to photosynthesize and only perch on bark (Commensalism, + / 0), whereas Rafflesia has no leaves and steals nutrients from the vine (Parasitism, + / -)."
      },
      {
        id: "D",
        text: "Mutualism [+ / -]: Tick & Dog | Commensalism [+ / 0]: Wild Orchid & Tree | Parasitism [+ / +]: Clownfish & Anemone",
        isCorrect: false,
        misconceptionTag: "Confusing Mutualism and Parasitism Outcome Codes",
        feedback: "Check the outcome codes: [+ / -] is Parasitism (one helped, one harmed like Tick & Dog), while [+ / +] is Mutualism (both helped like Clownfish & Anemone)."
      }
    ],
    classStats: { accuracy: 66, distractorCounts: { A: 21, B: 5, C: 5, D: 1 } }
  },
  {
    id: 8,
    code: "Q8-COMP-FOREST",
    type: "visual-mcq",
    category: "Competition Among Living Things",
    difficulty: "Application",
    bloomLevel: "Analyse",
    title: "Rainforest Nursery: Crowded Meranti Saplings",
    scenario: "A forester plants 50 young Meranti tree saplings packed tightly inside a single small pot, while another pot has only 3 well-spaced Meranti saplings. After 4 weeks, the 50 crowded saplings are thin, yellow, and stunted.",
    question: "Which combination of basic needs are the crowded Meranti saplings competing for (Intraspecific Competition)?",
    audioScript: "Field Observation Eight. Fifty young Meranti tree saplings planted tightly in one pot grow thin and stunted compared to three well-spaced saplings. Which basic needs are the crowded plants competing for?",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram comparing crowded vs well-spaced Meranti saplings competing for sunlight, water, nutrients, and space">
      <rect width="520" height="240" rx="14" fill="#1e293b"/>
      <!-- Left Pot: Crowded (High Competition) -->
      <rect x="20" y="20" width="225" height="200" rx="10" fill="#0f172a" stroke="#f87171" stroke-width="2"/>
      <text x="132" y="42" text-anchor="middle" fill="#f87171" font-family="sans-serif" font-size="13" font-weight="bold">Pot A: 50 Crowded Saplings</text>
      <!-- Pot A base -->
      <polygon points="65,155 195,155 180,205 80,205" fill="#b45309"/>
      <!-- Crowded thin yellow-green stems -->
      <g stroke="#a3e635" stroke-width="2.5">
        <line x1="80" y1="155" x2="75" y2="105"/><line x1="90" y1="155" x2="92" y2="112"/>
        <line x1="100" y1="155" x2="98" y2="100"/><line x1="110" y1="155" x2="112" y2="115"/>
        <line x1="120" y1="155" x2="118" y2="108"/><line x1="130" y1="155" x2="132" y2="102"/>
        <line x1="140" y1="155" x2="138" y2="114"/><line x1="150" y1="155" x2="152" y2="106"/>
        <line x1="160" y1="155" x2="162" y2="112"/><line x1="170" y1="155" x2="172" y2="108"/>
        <line x1="180" y1="155" x2="185" y2="115"/>
      </g>
      <text x="132" y="82" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="11">Stunted, thin &amp; pale leaves</text>

      <!-- Right Pot: Spaced (Low Competition) -->
      <rect x="275" y="20" width="225" height="200" rx="10" fill="#0f172a" stroke="#4ade80" stroke-width="2"/>
      <text x="387" y="42" text-anchor="middle" fill="#4ade80" font-family="sans-serif" font-size="13" font-weight="bold">Pot B: 3 Spaced Saplings</text>
      <polygon points="320,155 450,155 435,205 335,205" fill="#b45309"/>
      <!-- 3 healthy thick saplings -->
      <g stroke="#22c55e" stroke-width="5">
        <line x1="345" y1="155" x2="345" y2="85"/>
        <line x1="385" y1="155" x2="385" y2="78"/>
        <line x1="425" y1="155" x2="425" y2="85"/>
      </g>
      <g fill="#22c55e">
        <circle cx="345" cy="82" r="14"/><circle cx="385" cy="75" r="16"/><circle cx="425" cy="82" r="14"/>
      </g>
      <text x="387" y="56" text-anchor="middle" fill="#86efac" font-family="sans-serif" font-size="11">Tall stems &amp; lush green leaves</text>
    </svg>`,
    clue: "Careful! Do plants compete for 'mates' or 'prey' like animals do, or do they compete for specific plant growth factors?",
    options: [
      {
        id: "A",
        text: "Sunlight, water, soil nutrients (minerals), and space.",
        isCorrect: true,
        feedback: "Spot on! Plants compete for four key limited resources: Sunlight (for photosynthesis), Water, Nutrients/Minerals dissolved in soil, and Space (for roots and leaves to spread)."
      },
      {
        id: "B",
        text: "Sunlight, water, mates for reproduction, and territory.",
        isCorrect: false,
        misconceptionTag: "Confusing Plant Competition Factors with Animal Competition Factors",
        feedback: "Watch out! 'Mates' and 'territory' are factors that ANIMALS compete for. Plants compete strictly for Sunlight, Water, Soil Nutrients, and Space."
      },
      {
        id: "C",
        text: "Prey, shelter from predators, and carbon dioxide.",
        isCorrect: false,
        misconceptionTag: "Attributing Carnivorous/Animal Needs to Green Plants",
        feedback: "Remember: Meranti saplings are green plants that make their own food via photosynthesis! They don't hunt prey; they compete for Sunlight, Water, Soil Nutrients, and Space."
      },
      {
        id: "D",
        text: "Only water, because plants do not need space or nutrients once they sprout.",
        isCorrect: false,
        misconceptionTag: "Incomplete Understanding of Plant Competition Factors",
        feedback: "Water is only one factor! Without enough Space, roots get tangled; without Soil Nutrients, leaves turn yellow; and without Sunlight, lower leaves cannot photosynthesize."
      }
    ],
    classStats: { accuracy: 81, distractorCounts: { A: 26, B: 4, C: 1, D: 1 } }
  },
  {
    id: 9,
    code: "Q9-PREY-OWLS",
    type: "scenario-sim",
    category: "Prey-Predator & Biological Control",
    difficulty: "Higher-Order Application",
    bloomLevel: "Predict & Evaluate",
    title: "Eco-Simulation: Barn Owls in Malaysian Oil Palm Estates",
    scenario: "Rat populations are eating oil palm fruits in a Perak plantation. Instead of spraying toxic rat poison, the estate manager builds nest boxes to introduce Barn Owls (Burung Hantu Pungguk Jelapang).",
    question: "What is the relationship between the Barn Owl and the Rat, and what will happen to the oil palm fruit yield after Barn Owls establish their nests?",
    audioScript: "Field Observation Nine. An oil palm plantation in Perak introduces Barn Owls instead of chemical poison to control rats eating the palm fruits. Predict the ecological relationship and its impact on palm fruit yield.",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Population graph and diagram of Barn Owl predator and Rat prey in oil palm plantation">
      <rect width="520" height="240" rx="14" fill="#0f172a"/>
      <!-- Left: Ecological Chain -->
      <rect x="20" y="20" width="210" height="200" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="125" y="42" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">Biological Control Chain</text>
      <rect x="40" y="55" width="170" height="36" rx="6" fill="#065f46"/>
      <text x="125" y="78" text-anchor="middle" fill="#a7f3d0" font-family="sans-serif" font-size="12" font-weight="bold">🌴 Oil Palm Fruits (Producer)</text>
      <text x="125" y="108" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">▲ Eaten by</text>
      <rect x="40" y="115" width="170" height="36" rx="6" fill="#7f1d1d"/>
      <text x="125" y="138" text-anchor="middle" fill="#fecaca" font-family="sans-serif" font-size="12" font-weight="bold">🐀 Rats (Prey / Pest)</text>
      <text x="125" y="168" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">▲ Hunted by</text>
      <rect x="40" y="175" width="170" height="36" rx="6" fill="#1e3a8a"/>
      <text x="125" y="198" text-anchor="middle" fill="#bfdbfe" font-family="sans-serif" font-size="12" font-weight="bold">🦉 Barn Owl (Predator)</text>

      <!-- Right: Population Graph -->
      <rect x="250" y="20" width="250" height="200" rx="10" fill="#1e293b" stroke="#4ade80" stroke-width="1.5"/>
      <text x="375" y="42" text-anchor="middle" fill="#4ade80" font-family="sans-serif" font-size="13" font-weight="bold">Population Over Time</text>
      <!-- Axes -->
      <line x1="280" y1="185" x2="480" y2="185" stroke="#64748b" stroke-width="2"/>
      <line x1="280" y1="60" x2="280" y2="185" stroke="#64748b" stroke-width="2"/>
      <!-- Rat population line (dropping) -->
      <path d="M285 75 Q350 85 470 165" stroke="#f87171" stroke-width="3.5" fill="none"/>
      <text x="415" y="176" fill="#f87171" font-family="sans-serif" font-size="11" font-weight="bold">Rats (Prey) ↓</text>
      <!-- Palm Fruit Yield line (rising) -->
      <path d="M285 160 Q360 140 470 72" stroke="#4ade80" stroke-width="3.5" fill="none"/>
      <text x="395" y="70" fill="#4ade80" font-family="sans-serif" font-size="11" font-weight="bold">Palm Yield ↑</text>
      <text x="380" y="205" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Time After Owl Introduction →</text>
    </svg>`,
    clue: "Look at the population graph: When Barn Owls (Predators) hunt Rats (Prey), the rat population decreases. What happens to the oil palm fruits that the rats used to eat?",
    options: [
      {
        id: "A",
        text: "Prey-Predator (Barn Owl = Predator, Rat = Prey). Rat population decreases, causing oil palm fruit yield to increase without chemical pollution.",
        isCorrect: true,
        feedback: "Outstanding ecological prediction! Barn Owls act as natural predators that hunt rats (prey). With fewer rats damaging the crops, oil palm fruit yield increases safely and sustainably!"
      },
      {
        id: "B",
        text: "Parasitism (Barn Owl = Parasite, Rat = Host). Both rat population and oil palm yield decrease.",
        isCorrect: false,
        misconceptionTag: "Confusing Prey-Predator with Parasitism",
        feedback: "Remember the difference: A parasite lives on or inside a living host and feeds slowly, whereas a Predator (Barn Owl) hunts, kills, and eats its Prey (Rat) outright!"
      },
      {
        id: "C",
        text: "Prey-Predator (Rat = Predator, Barn Owl = Prey). Rat population increases rapidly.",
        isCorrect: false,
        misconceptionTag: "Reversing Predator and Prey Roles",
        feedback: "Careful! You reversed the roles: the animal that hunts and eats the other is the Predator (Barn Owl), and the animal being hunted is the Prey (Rat)."
      },
      {
        id: "D",
        text: "Mutualism (+ / +) between Barn Owls and Rats, so both populations rise together.",
        isCorrect: false,
        misconceptionTag: "Confusing Food Chain Predation with Mutualism",
        feedback: "Barn Owls hunt and eat rats for survival, so rats definitely do not benefit! This is a classic Prey-Predator interaction used in biological pest control."
      }
    ],
    classStats: { accuracy: 75, distractorCounts: { A: 24, B: 4, C: 3, D: 1 } }
  },
  {
    id: 10,
    code: "Q10-BOSS-ECOSYSTEM",
    type: "boss-challenge",
    category: "Boss Challenge: Ecosystem Synthesis",
    difficulty: "Mastery Boss Stage",
    bloomLevel: "Evaluate & Diagnose",
    title: "FINAL BOSS: The Mangrove & Reef Ecological Audit",
    scenario: "As Chief Junior Ecologist, you inspect four field reports written by interns. Three interns made a scientific classification error, and ONLY ONE intern wrote a 100% accurate report!",
    question: "Select the ONLY field report that is 100% scientifically accurate about Interactions Among Living Things:",
    audioScript: "Final Boss Challenge! The Mangrove and Reef Ecological Audit. Read the four field reports carefully and select the only report that is one hundred percent scientifically accurate.",
    svgDiagram: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Boss Challenge Chief Ecologist Field Audit Badge">
      <defs>
        <linearGradient id="bossGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#311042"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <rect width="520" height="240" rx="14" fill="url(#bossGrad)" stroke="#f59e0b" stroke-width="2.5"/>
      <!-- Trophy / Shield Emblem -->
      <polygon points="260,25 315,48 305,115 260,145 215,115 205,48" fill="#f59e0b" stroke="#fef08a" stroke-width="3"/>
      <text x="260" y="92" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-size="28" font-weight="bold">★</text>
      <text x="260" y="175" text-anchor="middle" fill="#fde047" font-family="sans-serif" font-size="16" font-weight="bold">FINAL ECOLOGICAL AUDIT</text>
      <text x="260" y="198" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-size="12">Verify Symbiosis (+/+, +/0, +/-), Competition &amp; Prey-Predator</text>
      <text x="260" y="218" text-anchor="middle" fill="#4ade80" font-family="sans-serif" font-size="11" font-weight="bold">+250 XP BONUS STAGE</text>
    </svg>`,
    clue: "Test each statement with the (+ / 0 / -) rule: Does Mistletoe (Dedalu) harm trees? Yes (+ / -). Does Bird's Nest Fern harm trees? No (+ / 0). Do Lions and Hyenas compete for different species? Interspecific!",
    options: [
      {
        id: "A",
        text: "Report Alpha: Bird's Nest Fern on an oil palm is Parasitism (+ / -), while Remora on a shark is Mutualism (+ / +).",
        isCorrect: false,
        misconceptionTag: "Double Misconception: Epiphyte as Parasite & Remora as Mutualism",
        feedback: "Report Alpha has two errors! Both Bird's Nest Fern on an oil palm AND Remora on a shark are actually examples of Commensalism (+ / 0), where the host tree and shark are unaffected (0)."
      },
      {
        id: "B",
        text: "Report Beta: Mistletoe (Dedalu) on a mango tree is Parasitism (+ / -); Barnacles on a whale are Commensalism (+ / 0); Nitrogen-fixing bacteria in legume roots are Mutualism (+ / +).",
        isCorrect: true,
        feedback: "CHAMPION ECOLOGIST! Report Beta is 100% accurate: Mistletoe steals water/nutrients from mango trees (+ / -), barnacles get free rides on whales without harming them (+ / 0), and Rhizobium bacteria supply nitrates to legume plants in exchange for shelter and sugar (+ / +)!"
      },
      {
        id: "C",
        text: "Report Gamma: Two male tigers fighting over a mate is Interspecific Competition, while trees competing for mates is Intraspecific Competition.",
        isCorrect: false,
        misconceptionTag: "Confusing Intraspecific vs Interspecific & Plant Competition",
        feedback: "Two errors in Report Gamma! Two tigers belong to the SAME species (Intraspecific competition), and plants never compete for mates—plants compete for sunlight, water, space, and soil nutrients!"
      },
      {
        id: "D",
        text: "Report Delta: Ticks living on a cat's skin are Commensalism (+ / 0) because ticks are small and do not kill the cat immediately.",
        isCorrect: false,
        misconceptionTag: "Misconception: Parasitism requires immediate death of the host",
        feedback: "Careful! A parasite does not need to kill its host immediately to be classified as Parasitism (+ / -). Because ticks suck blood, cause anemia, and transmit disease, the cat is harmed (-)."
      }
    ],
    classStats: { accuracy: 59, distractorCounts: { A: 8, B: 19, C: 3, D: 2 } }
  }
];

// Simulated Class Roster Data for Year 6 Inovatif (32 Students)
// Demonstrates how the Teacher Dashboard in Lesson Step 3 extracts real-time formative data
const CLASS_ROSTER_DATA = [
  { id: "S01", name: "Ahmad Danial", preScore: 70, postRedemption: 90, anxietyStatus: "Calm", flaggedQ: ["Q3-COM-EPIPHYTE", "Q10-BOSS-ECOSYSTEM"], misconception: "Epiphyte vs Parasite" },
  { id: "S02", name: "Aisyah Humaira", preScore: 90, postRedemption: 100, anxietyStatus: "Confident", flaggedQ: ["Q2-COM-REMORA"], misconception: "Remora Mutualism" },
  { id: "S03", name: "Amirul Hakim", preScore: 50, postRedemption: 80, anxietyStatus: "Supported (Used Shield)", flaggedQ: ["Q2-COM-REMORA", "Q3-COM-EPIPHYTE", "Q7-MATRIX-SYMBIOSIS"], misconception: "Commensalism (+/0) Neutral Host" },
  { id: "S04", name: "Brendan Lim", preScore: 80, postRedemption: 100, anxietyStatus: "Confident", flaggedQ: ["Q3-COM-EPIPHYTE"], misconception: "Epiphyte vs Parasite" },
  { id: "S05", name: "Chong Wei Ting", preScore: 100, postRedemption: 100, anxietyStatus: "Confident", flaggedQ: [], misconception: "None (Mastered)" },
  { id: "S06", name: "Darshini a/p Rajan", preScore: 60, postRedemption: 90, anxietyStatus: "Calm", flaggedQ: ["Q2-COM-REMORA", "Q3-COM-EPIPHYTE", "Q10-BOSS-ECOSYSTEM"], misconception: "Commensalism (+/0) Neutral Host" },
  { id: "S07", name: "Farah Nabila", preScore: 70, postRedemption: 90, anxietyStatus: "Calm", flaggedQ: ["Q2-COM-REMORA", "Q7-MATRIX-SYMBIOSIS"], misconception: "Remora Mutualism" },
  { id: "S08", name: "Harith Iskandar", preScore: 40, postRedemption: 80, anxietyStatus: "Supported (Calm Timer)", flaggedQ: ["Q2-COM-REMORA", "Q3-COM-EPIPHYTE", "Q6-MUT-HERMIT", "Q10-BOSS-ECOSYSTEM"], misconception: "Epiphyte vs Parasite" },
  { id: "S09", name: "Izzah Insyirah", preScore: 80, postRedemption: 90, anxietyStatus: "Confident", flaggedQ: ["Q10-BOSS-ECOSYSTEM"], misconception: "Minor Synthesis Slip" },
  { id: "S10", name: "Kavitha a/p Suresh", preScore: 60, postRedemption: 90, anxietyStatus: "Supported (Used Shield)", flaggedQ: ["Q3-COM-EPIPHYTE", "Q7-MATRIX-SYMBIOSIS", "Q9-PREY-OWLS"], misconception: "Epiphyte vs Parasite" },
  { id: "S11", name: "Lee Jun Jie", preScore: 70, postRedemption: 100, anxietyStatus: "Calm", flaggedQ: ["Q2-COM-REMORA", "Q3-COM-EPIPHYTE"], misconception: "Commensalism (+/0) Neutral Host" },
  { id: "S12", name: "Muhammad Adam", preScore: 50, postRedemption: 80, anxietyStatus: "Supported (Calm Timer)", flaggedQ: ["Q2-COM-REMORA", "Q3-COM-EPIPHYTE", "Q4-PAR-RAFFLESIA"], misconception: "Epiphyte vs Parasite" }
];
