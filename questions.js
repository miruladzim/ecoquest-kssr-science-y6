// ============================================================================
// ECOQUEST — INTERACTIVE STEM LAB QUESTION BANK & SIMULATION CONTROLS
// KSSR Year 6 Science — Unit 4: Interaction Among Living Things
// ============================================================================

const QUESTION_BANK = [
  {
    id: 1,
    code: "01 · MUTUALISM (+ / +)",
    category: "Mutualism (+ / +)",
    title: "Coral Reef Symbiosis: Clownfish & Sea Anemone",
    scenario: "Drag the slider below to move the clownfish into the sea anemone's tentacles and observe how both species respond.",
    simControlLabel: "Interactive Test: Clownfish Position",
    simMinLabel: "Open Water (Exposed)",
    simMaxLabel: "Inside Anemone (+ / +)",
    simDefault: 80,
    question: "Why is the interaction between the clownfish and sea anemone classified as mutualism (+ / +)?",
    audioScript: "Stage 1. Drag the slider to move the clownfish into the sea anemone's tentacles. Why is this interaction classified as mutualism?",
    tags3D: [
      { name: "Clownfish", effect: "+ Protected from predators", color: "#059669" },
      { name: "Sea Anemone", effect: "+ Cleaned & attracts prey", color: "#059669" }
    ],
    clue: "In mutualism (+ / +), both species gain a clear survival advantage from living together.",
    options: [
      {
        id: "A",
        text: "The clownfish gains shelter from predators (+), while the sea anemone is cleaned and attracts prey (+).",
        isCorrect: true,
        feedback: "Both organisms benefit (+ / +): a mucus coating protects the clownfish from stings, while the clownfish defends and cleans the sea anemone."
      },
      {
        id: "B",
        text: "The clownfish gains shelter (+), while the sea anemone is neither helped nor harmed (0).",
        isCorrect: false,
        feedback: "That describes commensalism (+ / 0). In reality, the sea anemone also benefits (+) because the clownfish removes parasites and wards off butterflyfish."
      },
      {
        id: "C",
        text: "The clownfish feeds on the sea anemone's tentacles, weakening the host (+ / -).",
        isCorrect: false,
        feedback: "That would be parasitism (+ / -). Clownfish do not damage healthy tentacles; both partners thrive together (+ / +)."
      },
      {
        id: "D",
        text: "The sea anemone stings and digests the clownfish as prey.",
        isCorrect: false,
        feedback: "Clownfish possess a specialized mucus coating that prevents the anemone's stinging cells from firing."
      }
    ]
  },
  {
    id: 2,
    code: "02 · COMMENSALISM (+ / 0)",
    category: "Commensalism (+ / 0)",
    title: "Pelagic Hitchhiker: Remora Fish & Shark",
    scenario: "Use the slider to attach the remora fish beneath the swimming shark and observe its feeding behavior and the shark's energy meter.",
    simControlLabel: "Interactive Test: Remora Attachment",
    simMinLabel: "Detached",
    simMaxLabel: "Attached Under Shark (+ / 0)",
    simDefault: 85,
    question: "Why do marine biologists classify the remora and shark relationship as commensalism (+ / 0)?",
    audioScript: "Stage 2. Attach the remora fish underneath the shark to observe how it catches drifting scraps. Why is this classified as commensalism?",
    tags3D: [
      { name: "Remora Fish", effect: "+ Transport & food scraps", color: "#4f46e5" },
      { name: "Shark Host", effect: "0 Unaffected (100% Energy)", color: "#64748b" }
    ],
    clue: "Check the shark's energy meter in the simulation: does the shark lose any nutrients or gain any help from floating food scraps?",
    options: [
      {
        id: "A",
        text: "Both benefit equally because the remora hunts prey to feed the shark (+ / +).",
        isCorrect: false,
        feedback: "The remora does not hunt food for the shark; it simply consumes tiny leftover scraps that drift away after the shark feeds."
      },
      {
        id: "B",
        text: "The remora gains free transport, protection, and food scraps (+), while the shark is unaffected (0).",
        isCorrect: true,
        feedback: "In commensalism (+ / 0), the remora gains transport and leftover food (+), while the shark experiences neither harm nor benefit (0)."
      },
      {
        id: "C",
        text: "The remora pierces the shark's skin to draw blood (+ / -).",
        isCorrect: false,
        feedback: "Unlike parasites such as lampreys, the remora's flat suction disc holds onto the skin surface without piercing tissue (0)."
      },
      {
        id: "D",
        text: "The shark and remora compete for the same large fish (- / -).",
        isCorrect: false,
        feedback: "Sharks hunt large prey, whereas remoras only consume tiny floating fragments ignored by the shark."
      }
    ]
  },
  {
    id: 3,
    code: "03 · PLANT COMMENSALISM (+ / 0)",
    category: "Plant Commensalism (+ / 0)",
    title: "Canopy Epiphyte: Bird's Nest Fern on Oil Palm",
    scenario: "Slide the X-Ray Bark Scanner across the oil palm trunk to inspect whether the fern's roots penetrate the tree's internal vascular tissue.",
    simControlLabel: "X-Ray Bark Scanner: Inspect Root Depth",
    simMinLabel: "Normal View",
    simMaxLabel: "100% X-Ray Cross-Section",
    simDefault: 75,
    question: "Why is the Bird's Nest Fern classified as commensalism (+ / 0) rather than parasitism?",
    audioScript: "Stage 3. Slide the X-Ray scanner across the trunk to inspect the Bird's Nest Fern roots. Why is it classified as commensalism rather than parasitism?",
    tags3D: [
      { name: "Bird's Nest Fern", effect: "+ Elevated for sunlight", color: "#059669" },
      { name: "Oil Palm Trunk", effect: "0 Vascular sap untouched", color: "#64748b" }
    ],
    clue: "Look at the X-Ray view: the fern's roots clasp only the outer bark, while its green fronds make food via photosynthesis.",
    options: [
      {
        id: "A",
        text: "Its roots penetrate the oil palm's vascular tissue to extract water and glucose (+ / -).",
        isCorrect: false,
        feedback: "Parasitic plants like mistletoe penetrate stems, but the Bird's Nest Fern is an epiphyte that only clings to the outer bark surface (0)."
      },
      {
        id: "B",
        text: "It perches on the outer bark to access sunlight and photosynthesizes its own food (+), leaving the tree unharmed (0).",
        isCorrect: true,
        feedback: "As a green epiphyte, the Bird's Nest Fern produces its own food via photosynthesis (+) and uses the trunk strictly for physical support (0)."
      },
      {
        id: "C",
        text: "It supplies excess glucose into the oil palm trunk during dry seasons (+ / +).",
        isCorrect: false,
        feedback: "The fern's roots do not connect to the oil palm's phloem, so no nutrients are exchanged between the two plants (0)."
      },
      {
        id: "D",
        text: "The oil palm crown blocks the fern to prevent it from growing (- / -).",
        isCorrect: false,
        feedback: "Perching on the upper trunk actually helps the fern escape the dark forest floor to gain better light exposure (+)."
      }
    ]
  },
  {
    id: 4,
    code: "04 · PLANT PARASITISM (+ / -)",
    category: "Plant Parasitism (+ / -)",
    title: "Holoparasite: Giant Rafflesia & Tetrastigma Vine",
    scenario: "Drag the slider to observe how the leafless Rafflesia flower grows by drawing sap and water out of the host Tetrastigma vine.",
    simControlLabel: "Interactive Test: Rafflesia Nutrient Extraction",
    simMinLabel: "Early Bud Stage",
    simMaxLabel: "Full Bloom (Host Drained)",
    simDefault: 80,
    question: "How does the Rafflesia obtain nutrients, and how does this affect the host vine?",
    audioScript: "Stage 4. Observe how the leafless Rafflesia draws sap from the host vine. How does it obtain nutrients, and how does this affect the vine?",
    tags3D: [
      { name: "Rafflesia Flower", effect: "+ Absorbs host nutrients", color: "#059669" },
      { name: "Tetrastigma Vine", effect: "- Drained of water & sap", color: "#e11d48" }
    ],
    clue: "Without chlorophyll for photosynthesis, the Rafflesia depends entirely on extracting nutrients from inside the host vine.",
    options: [
      {
        id: "A",
        text: "Commensalism (+ / 0) — It rests on the vine's bark without absorbing nutrients.",
        isCorrect: false,
        feedback: "Because Rafflesia lacks green leaves to photosynthesize, it cannot survive by merely resting on the surface."
      },
      {
        id: "B",
        text: "Parasitism (+ / -) — It absorbs water and nutrients directly from the host vine (+), weakening the vine (-).",
        isCorrect: true,
        feedback: "Rafflesia is a holoparasite (+ / -) whose thread-like haustoria penetrate the Tetrastigma vine to draw out water and nutrients."
      },
      {
        id: "C",
        text: "Mutualism (+ / +) — It exchanges soil minerals for sugar from the vine.",
        isCorrect: false,
        feedback: "Rafflesia has no roots in the soil; it only extracts resources from the host vine without providing any benefit in return (+ / -)."
      },
      {
        id: "D",
        text: "Prey-Predator — It traps and digests carrion flies like a pitcher plant.",
        isCorrect: false,
        feedback: "Carrion flies only pollinate the flower; all of Rafflesia's nutrition is drawn from the host vine (+ / -)."
      }
    ]
  },
  {
    id: 5,
    code: "05 · ENDOPARASITISM (+ / -)",
    category: "Animal Parasitism (+ / -)",
    title: "Endoparasite: Host Mammal & Intestinal Tapeworm",
    scenario: "Adjust the parasite load slider to observe how an intestinal tapeworm intercepts digested glucose and amino acids inside the host.",
    simControlLabel: "Interactive Test: Intestinal Parasite Activity",
    simMinLabel: "Healthy Intestine",
    simMaxLabel: "Active Tapeworm (+ / -)",
    simDefault: 75,
    question: "Identify the parasite (+) and the host (-) in this internal relationship:",
    audioScript: "Stage 5. Adjust the slider to see how a tapeworm intercepts nutrients inside the intestine. Identify the parasite and the host.",
    tags3D: [
      { name: "Tapeworm", effect: "+ Parasite (Absorbs food)", color: "#059669" },
      { name: "Host Cat", effect: "- Deprived of nutrients", color: "#e11d48" }
    ],
    clue: "The organism stealing digested nutrients is the parasite (+), and the organism suffering malnutrition is the host (-).",
    options: [
      {
        id: "A",
        text: "Parasite: Tapeworm (+) | Host: Cat (-). The tapeworm absorbs digested nutrients inside the cat's intestine.",
        isCorrect: true,
        feedback: "The tapeworm (+) is an endoparasite that absorbs pre-digested nutrients, leaving the host cat (-) nutrient-deficient."
      },
      {
        id: "B",
        text: "Parasite: Cat (+) | Host: Tapeworm (-). The cat digests the tapeworm for protein.",
        isCorrect: false,
        feedback: "Those roles are reversed: the larger animal suffering harm is the host (-), while the internal worm is the parasite (+)."
      },
      {
        id: "C",
        text: "Commensalism (+ / 0) because the tapeworm only consumes undigested waste.",
        isCorrect: false,
        feedback: "Tapeworms absorb essential glucose and amino acids in the small intestine, directly harming the host (-)."
      },
      {
        id: "D",
        text: "Mutualism (+ / +) because the tapeworm assists the cat with digestion.",
        isCorrect: false,
        feedback: "Unlike beneficial gut bacteria, tapeworms deplete the host's nutrients and cause illness (+ / -)."
      }
    ]
  },
  {
    id: 6,
    code: "06 · MUTUALISM (+ / +)",
    category: "Mutualism (+ / +)",
    title: "Tidal Partnership: Hermit Crab & Sea Anemone",
    scenario: "Move the hermit crab across the seabed using the slider to see how its sea anemone partner deters an approaching octopus predator.",
    simControlLabel: "Interactive Test: Seabed Patrol & Defense",
    simMinLabel: "Resting Zone",
    simMaxLabel: "Predator Deterred (+ / +)",
    simDefault: 70,
    question: "How do both the hermit crab and the sea anemone benefit from this partnership?",
    audioScript: "Stage 6. Move the hermit crab across the seabed. How do both the hermit crab and the sea anemone benefit from this partnership?",
    tags3D: [
      { name: "Hermit Crab", effect: "+ Stinging defense shield", color: "#059669" },
      { name: "Sea Anemone", effect: "+ Mobility to feeding areas", color: "#059669" }
    ],
    clue: "The anemone's stinging tentacles deter octopuses (+), while the mobile crab carries the stationary anemone to richer feeding grounds (+).",
    options: [
      {
        id: "A",
        text: "The anemone's stinging cells deter predators (+), while the crab transports the anemone to new food sources (+).",
        isCorrect: true,
        feedback: "Both partners gain a clear advantage (+ / +): the crab gains protection, and the sessile anemone gains mobility and food scraps."
      },
      {
        id: "B",
        text: "The hermit crab parasitizes the base of the sea anemone for food (+ / -).",
        isCorrect: false,
        feedback: "Hermit crabs actively protect their sea anemone partner and even transfer it when moving to a larger shell (+ / +)."
      },
      {
        id: "C",
        text: "Only the hermit crab benefits (+), while the sea anemone gains nothing from moving (0).",
        isCorrect: false,
        feedback: "Because sea anemones are normally stationary, riding on the crab's shell exposes them to wider food sources and food scraps (+ / +)."
      },
      {
        id: "D",
        text: "Both species compete for space inside the snail shell (- / -).",
        isCorrect: false,
        feedback: "The crab occupies the interior of the shell while the anemone attaches to the exterior surface (+ / +)."
      }
    ]
  },
  {
    id: 7,
    code: "07 · ECOLOGICAL OUTCOME MATRIX",
    category: "Symbiosis Synthesis",
    title: "Ecological Code Classification: [+ / +], [+ / 0], [+ / -]",
    scenario: "Slide across the three ecological outcome models to inspect Species A and Species B fitness bars for Mutualism, Commensalism, and Parasitism.",
    simControlLabel: "Inspect Outcome Model: [+ / +] vs [+ / 0] vs [+ / -]",
    simMinLabel: "Mutualism [+ / +]",
    simMaxLabel: "Parasitism [+ / -]",
    simDefault: 50,
    question: "Which row accurately pairs all three ecological outcome codes with their correct species examples?",
    audioScript: "Stage 7. Compare the three ecological outcome codes and match them with their accurate species examples.",
    tags3D: [
      { name: "Mutualism [+ / +]", effect: "Both species thrive", color: "#059669" },
      { name: "Commensalism [+ / 0]", effect: "One helped, one neutral", color: "#4f46e5" },
      { name: "Parasitism [+ / -]", effect: "One helped, host harmed", color: "#e11d48" }
    ],
    clue: "Mynah birds eat ticks off buffaloes [+ / +]; wild orchids perch harmlessly on tree bark [+ / 0]; ticks draw blood from dogs [+ / -].",
    options: [
      {
        id: "A",
        text: "[+ / +] Mynah & Buffalo  ·  [+ / 0] Wild Orchid & Tree  ·  [+ / -] Tick & Dog",
        isCorrect: true,
        feedback: "Accurate classification across all three categories: Mutualism [+ / +], Commensalism [+ / 0], and Parasitism [+ / -]."
      },
      {
        id: "B",
        text: "[+ / 0] Mynah & Buffalo  ·  [+ / +] Remora & Shark  ·  [+ / -] Rafflesia & Vine",
        isCorrect: false,
        feedback: "Mutualism [+ / +] and Commensalism [+ / 0] are swapped in the first two pairs."
      },
      {
        id: "C",
        text: "[+ / +] Mynah & Buffalo  ·  [+ / 0] Rafflesia & Vine  ·  [+ / -] Wild Orchid & Tree",
        isCorrect: false,
        feedback: "Wild orchids photosynthesize on bark [+ / 0], whereas leafless Rafflesia parasitizes vines [+ / -]."
      },
      {
        id: "D",
        text: "[+ / -] Clownfish & Anemone  ·  [+ / 0] Wild Orchid & Tree  ·  [+ / +] Tick & Dog",
        isCorrect: false,
        feedback: "Ticks harm dogs [+ / -], whereas clownfish and sea anemones mutually benefit [+ / +]."
      }
    ]
  },
  {
    id: 8,
    code: "08 · INTRASPECIFIC COMPETITION",
    category: "Plant Competition",
    title: "Resource Competition: Crowded vs. Spaced Saplings",
    scenario: "Drag the planting density slider from 3 spaced saplings to 25 crowded saplings and observe the change in stem height, root space, and leaf color.",
    simControlLabel: "Interactive Test: Sapling Planting Density",
    simMinLabel: "3 Spaced Saplings (Optimal)",
    simMaxLabel: "25 Crowded Saplings (Stunted)",
    simDefault: 80,
    question: "Which four limited resources are the crowded saplings competing for?",
    audioScript: "Stage 8. Increase the planting density slider to see how crowding stunts sapling growth. Which four resources are the crowded saplings competing for?",
    tags3D: [
      { name: "Crowded Pot", effect: "- High competition (Stunted)", color: "#d97706" },
      { name: "Spaced Pot", effect: "+ Optimal light, water & space", color: "#059669" }
    ],
    clue: "Unlike animals, green plants do not compete for mates or prey—focus on what roots and leaves require.",
    options: [
      {
        id: "A",
        text: "Sunlight, water, soil nutrients (minerals), and space.",
        isCorrect: true,
        feedback: "Plants compete for four essential growth factors: sunlight, water, dissolved soil minerals, and root/canopy space."
      },
      {
        id: "B",
        text: "Sunlight, water, mates for reproduction, and territory.",
        isCorrect: false,
        feedback: "Mates and territory apply to animal competition, not plant competition."
      },
      {
        id: "C",
        text: "Prey, shelter from predators, and water.",
        isCorrect: false,
        feedback: "Autotrophic green saplings produce food via photosynthesis rather than hunting prey."
      },
      {
        id: "D",
        text: "Water only, as saplings do not require space or sunlight once sprouted.",
        isCorrect: false,
        feedback: "Without adequate sunlight, soil nutrients, and space, crowded saplings become etiolated and stunted."
      }
    ]
  },
  {
    id: 9,
    code: "09 · PREY-PREDATOR & BIO-CONTROL",
    category: "Prey-Predator Interaction",
    title: "Biological Control: Barn Owls & Plantation Rats",
    scenario: "Use the slider to introduce Barn Owls into the oil palm plantation and observe the real-time effect on the rat pest population and palm fruit yield.",
    simControlLabel: "Bio-Control Simulator: Barn Owl Population",
    simMinLabel: "0 Owls (Rat Outbreak)",
    simMaxLabel: "10 Barn Owls (High Crop Yield)",
    simDefault: 80,
    question: "How does introducing Barn Owls (predators) affect the rat population and oil palm yield?",
    audioScript: "Stage 9. Increase the Barn Owl population on the slider to observe biological control in action. How does this affect rat populations and palm yield?",
    tags3D: [
      { name: "Barn Owl (Predator)", effect: "Hunts plantation rats", color: "#4f46e5" },
      { name: "Palm Fruit Yield", effect: "Increases ↑ as rats drop ↓", color: "#059669" }
    ],
    clue: "As natural predators reduce the rat pest population, fewer oil palm fruits are damaged.",
    options: [
      {
        id: "A",
        text: "Rat population decreases ↓, resulting in higher oil palm fruit yield ↑ without chemical pesticides.",
        isCorrect: true,
        feedback: "Biological control uses natural prey-predator interactions to suppress rat pests ↓ and protect crop yield ↑ sustainably."
      },
      {
        id: "B",
        text: "Both rat populations and oil palm fruit yields decline.",
        isCorrect: false,
        feedback: "Barn owls are carnivores that prey on rats, protecting the oil palm fruits from damage."
      },
      {
        id: "C",
        text: "Rats act as predators and owls as prey, causing rat numbers to rise ↑.",
        isCorrect: false,
        feedback: "The barn owl is the apex predator in this food chain, while the rat is the prey."
      },
      {
        id: "D",
        text: "Barn owls and rats form a mutualistic (+ / +) relationship.",
        isCorrect: false,
        feedback: "Because owls hunt and consume rats, the interaction is strictly prey-predator."
      }
    ]
  },
  {
    id: 10,
    code: "10 · FINAL SYNTHESIS AUDIT",
    category: "Ecosystem Synthesis",
    title: "Final Ecological Audit: Verify the Field Report",
    scenario: "Slide through the complete KSSR Unit 4 Ecosystem Map to review Symbiosis, Prey-Predator, and Competition before making your final verification.",
    simControlLabel: "Interactive Review: Unit 4 Ecosystem Network",
    simMinLabel: "Symbiosis",
    simMaxLabel: "Competition & Predation",
    simDefault: 65,
    question: "Which statement below is 100% scientifically accurate regarding interactions among living things?",
    audioScript: "Stage 10. Final synthesis audit. Select the statement that is one hundred percent scientifically accurate.",
    tags3D: [
      { name: "Synthesis Stage", effect: "+250 Bonus Points", color: "#d97706" },
      { name: "Mastery Check", effect: "All Interaction Types", color: "#059669" }
    ],
    clue: "Verify each example using the [+ / +], [+ / 0], and [+ / -] framework.",
    options: [
      {
        id: "A",
        text: "Bird's Nest Fern on an oil palm is parasitism (+ / -), while remora on a shark is mutualism (+ / +).",
        isCorrect: false,
        feedback: "Both the Bird's Nest Fern on a trunk and the remora on a shark are examples of commensalism (+ / 0)."
      },
      {
        id: "B",
        text: "Mistletoe on a mango tree is parasitism (+ / -); barnacles on a whale are commensalism (+ / 0); nitrogen-fixing bacteria in legume roots are mutualism (+ / +).",
        isCorrect: true,
        feedback: "Complete mastery: Mistletoe extracts host sap (+ / -), barnacles gain transport on whales (+ / 0), and Rhizobium bacteria exchange nitrates for plant sugars (+ / +)."
      },
      {
        id: "C",
        text: "Trees compete for mates, and two tigers fighting over territory is interspecific competition.",
        isCorrect: false,
        feedback: "Plants never compete for mates, and competition between two individuals of the same species (tigers) is intraspecific."
      },
      {
        id: "D",
        text: "Ticks feeding on a cat are commensalism (+ / 0) because they do not cause immediate death.",
        isCorrect: false,
        feedback: "Parasitism (+ / -) does not require immediate death; ticks deplete blood and transmit disease, harming the host (-)."
      }
    ]
  }
];
