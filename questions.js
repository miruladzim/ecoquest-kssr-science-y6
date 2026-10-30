// ============================================================================
// ECOQUEST 3D: KID-FRIENDLY QUESTION BANK & 3D SCENE LABELS
// KSSR Year 6 Science — Unit 4: Interaction Among Living Things
// ============================================================================

const QUESTION_BANK = [
  {
    id: 1,
    code: "Q1-MUT-CORAL",
    category: "Mutualism (+ / +)",
    bloomLevel: "Understand & Classify",
    title: "3D Reef: Clownfish & Sea Anemone",
    scenario: "Spin the 3D Coral Reef! Watch the orange Clownfish swimming safely inside the Sea Anemone's stinging tentacles.",
    question: "How do the Clownfish and Sea Anemone help EACH OTHER (+ / +)?",
    audioScript: "Level 1! Look at the 3D coral reef. How do the Clownfish and the Sea Anemone help each other in Mutualism?",
    tags3D: [
      { icon: "🐠", name: "Clownfish", effect: "+ Safe Shelter", color: "#22c55e" },
      { icon: "🌸", name: "Sea Anemone", effect: "+ Cleaned & Protected", color: "#22c55e" }
    ],
    clue: "In Mutualism (+ / +), BOTH animals win! The fish gets a safe home, and the anemone gets cleaned.",
    options: [
      {
        id: "A",
        text: "Clownfish gets a safe home (+), and Sea Anemone gets cleaned (+).",
        isCorrect: true,
        feedback: "Awesome job! Both partners win (+ / +): the Clownfish hides safely from big fish, and it cleans the Sea Anemone!"
      },
      {
        id: "B",
        text: "Clownfish gets a home (+), but Sea Anemone gets nothing (0).",
        isCorrect: false,
        misconceptionTag: "Confusing Mutualism with Commensalism",
        feedback: "Almost! The Sea Anemone actually benefits too (+) because the Clownfish cleans it and chases away predators!"
      },
      {
        id: "C",
        text: "Clownfish eats and hurts the Sea Anemone (+ / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Mutualism with Parasitism",
        feedback: "Not quite! Clownfish never hurt the Sea Anemone—they are best friends that protect each other (+ / +)."
      },
      {
        id: "D",
        text: "Sea Anemone stings and eats the Clownfish.",
        isCorrect: false,
        misconceptionTag: "Confusing Symbiosis with Prey-Predator",
        feedback: "Look at the 3D fish! Clownfish have special slimy skin so the tentacles don't sting them. Both help each other (+ / +)!"
      }
    ],
    classStats: { accuracy: 84, distractorCounts: { A: 27, B: 3, C: 1, D: 1 } }
  },
  {
    id: 2,
    code: "Q2-COM-REMORA",
    category: "Commensalism (+ / 0)",
    bloomLevel: "Analyse & Differentiate",
    title: "3D Ocean: Shark & Remora Fish",
    scenario: "Rotate the 3D Shark! See the blue Remora fish hitching a free ride underneath the Shark's belly to catch falling food crumbs.",
    question: "Why is the Remora and Shark called Commensalism (+ / 0)?",
    audioScript: "Level 2! Look under the 3D shark's belly. Why is the Remora and Shark relationship called Commensalism?",
    tags3D: [
      { icon: "🐟", name: "Remora Fish", effect: "+ Free Ride & Food", color: "#38bdf8" },
      { icon: "🦈", name: "Shark", effect: "0 Not Helped or Hurt", color: "#94a3b8" }
    ],
    clue: "Ask yourself: Does the big Shark care if the tiny Remora catches leftover crumbs floating away?",
    options: [
      {
        id: "A",
        text: "Both benefit because the Remora hunts food for the Shark (+ / +).",
        isCorrect: false,
        misconceptionTag: "False Mutualism (Thinking Remora feeds Shark)",
        feedback: "Careful! The tiny Remora doesn't feed the Shark—it just eats leftover crumbs floating away. The Shark isn't helped or hurt (0)!"
      },
      {
        id: "B",
        text: "Remora gets a free ride & food scraps (+), while the Shark is unaffected (0).",
        isCorrect: true,
        feedback: "Spot on! That's Commensalism (+ / 0): the Remora wins (+), and the big Shark doesn't gain or lose anything (0)!"
      },
      {
        id: "C",
        text: "Remora sucks blood from the Shark's belly (+ / -).",
        isCorrect: false,
        misconceptionTag: "Thinking Remora suction disc sucks blood",
        feedback: "Look closely at the 3D Remora! Its head pad only holds on like a suction cup for a free ride—it never sucks blood (0)!"
      },
      {
        id: "D",
        text: "Shark and Remora fight over the same big prey (- / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Commensalism with Competition",
        feedback: "Not quite! The Remora only eats tiny leftover crumbs that the big Shark ignores."
      }
    ],
    classStats: { accuracy: 53, distractorCounts: { A: 11, B: 17, C: 3, D: 1 } }
  },
  {
    id: 3,
    code: "Q3-COM-EPIPHYTE",
    category: "Plant Commensalism (+ / 0)",
    bloomLevel: "Evaluate & Distinguish",
    title: "3D Canopy: Bird's Nest Fern on Oil Palm",
    scenario: "Spin the 3D Oil Palm Tree! Notice the green Bird's Nest Fern sitting on the outer bark to reach the glowing golden Sun.",
    question: "Why is the Bird's Nest Fern NOT a parasite? (It is Commensalism + / 0!)",
    audioScript: "Level 3! Look at the green Bird's Nest Fern sitting on the oil palm trunk. Why is it Commensalism and NOT a parasite?",
    tags3D: [
      { icon: "🌿", name: "Bird's Nest Fern", effect: "+ Gets Sunlight", color: "#4ade80" },
      { icon: "🌴", name: "Oil Palm Tree", effect: "0 Bark Unharmed", color: "#facc15" }
    ],
    clue: "Look at the fern's bright green leaves! Since it makes its own food from sunlight, does it steal food from the tree?",
    options: [
      {
        id: "A",
        text: "Its roots drill deep inside the tree to steal water and sugar (+ / -).",
        isCorrect: false,
        misconceptionTag: "Assuming all plants on trees are parasites",
        feedback: "Watch out for this famous trap! Bird's Nest Fern has green leaves to make its own food—it only sits on the outside bark without hurting the tree (0)!"
      },
      {
        id: "B",
        text: "It rests on the outer bark for sunlight & makes its own food (+), without hurting the tree (0).",
        isCorrect: true,
        feedback: "Brilliant! Because the green fern makes its own food via photosynthesis (+), the Oil Palm tree is completely unharmed (0)!"
      },
      {
        id: "C",
        text: "It gives extra sugar to feed the Oil Palm tree (+ / +).",
        isCorrect: false,
        misconceptionTag: "Confusing Epiphyte with Mutualism",
        feedback: "Almost! The fern keeps the food it makes for itself, so the Oil Palm tree is neither helped nor harmed (0)."
      },
      {
        id: "D",
        text: "The Oil Palm tree fights the fern for soil space (- / -).",
        isCorrect: false,
        misconceptionTag: "Confusing Epiphyte with Competition",
        feedback: "Look at the 3D trunk—the fern sits high up on the bark, not in the ground soil!"
      }
    ],
    classStats: { accuracy: 47, distractorCounts: { A: 14, B: 15, C: 2, D: 1 } }
  },
  {
    id: 4,
    code: "Q4-PAR-RAFFLESIA",
    category: "Plant Parasitism (+ / -)",
    bloomLevel: "Analyse",
    title: "3D Jungle: Giant Rafflesia & Vine",
    scenario: "Check out the giant red 3D Rafflesia flower! Notice it has NO green leaves at all—it grows directly on a jungle vine.",
    question: "How does the giant Rafflesia survive without any green leaves?",
    audioScript: "Level 4! The giant Rafflesia flower has no green leaves to make food. How does it survive on the jungle vine?",
    tags3D: [
      { icon: "🌺", name: "Rafflesia (Parasite)", effect: "+ Steals Nutrients", color: "#f87171" },
      { icon: "🪵", name: "Host Vine", effect: "- Weakened & Harmed", color: "#fb923c" }
    ],
    clue: "With no green leaves to make food from sunlight, the Rafflesia must steal food from the vine (+ / -)!",
    options: [
      {
        id: "A",
        text: "Commensalism (+ / 0) — It sits harmlessly on the vine.",
        isCorrect: false,
        misconceptionTag: "Confusing Parasitic Rafflesia with Epiphytes",
        feedback: "Remember: Rafflesia has NO green leaves! It has to drain water and food from inside the vine, which hurts the vine (-)."
      },
      {
        id: "B",
        text: "Parasitism (+ / -) — It steals water & nutrients from the host vine (+), weakening the vine (-).",
        isCorrect: true,
        feedback: "Spot on! Rafflesia is a parasite (+ / -) that absorbs nutrients right out of the host vine!"
      },
      {
        id: "C",
        text: "Mutualism (+ / +) — Both the Rafflesia and vine feed each other.",
        isCorrect: false,
        misconceptionTag: "Confusing Parasitism with Mutualism",
        feedback: "Not quite! Rafflesia only takes food and gives nothing back, so the host vine is harmed (-)."
      },
      {
        id: "D",
        text: "Prey-Predator — Rafflesia eats insects like a pitcher plant.",
        isCorrect: false,
        misconceptionTag: "Confusing Rafflesia with Carnivorous Plants",
        feedback: "Flies only visit Rafflesia to spread pollen! Its food comes from parasitizing the vine (+ / -)."
      }
    ],
    classStats: { accuracy: 78, distractorCounts: { A: 4, B: 25, C: 1, D: 2 } }
  },
  {
    id: 5,
    code: "Q5-PAR-TAPEWORM",
    category: "Animal Parasitism (+ / -)",
    bloomLevel: "Understand",
    title: "3D Vet Clinic: Cat & Tapeworm",
    scenario: "Spin the 3D Vet Model! A poor orange cat is thin and weak because a yellow tapeworm is living inside its intestine.",
    question: "In this Parasitism (+ / -), which one is the Parasite (+) and which is the Host (-)?",
    audioScript: "Level 5! A cat is weak because a tapeworm lives inside its intestine. Which is the parasite and which is the host?",
    tags3D: [
      { icon: "🪱", name: "Tapeworm", effect: "+ Parasite (Steals Food)", color: "#4ade80" },
      { icon: "🐱", name: "Orange Cat", effect: "- Host (Gets Weak)", color: "#f87171" }
    ],
    clue: "The thief that steals digested food is the Parasite (+), and the animal that gets sick is the Host (-).",
    options: [
      {
        id: "A",
        text: "Parasite: Tapeworm (+) | Host: Cat (-). The worm steals food inside the cat's gut.",
        isCorrect: true,
        feedback: "Well done! The tapeworm (+) steals digested nutrients, leaving the host cat (-) weak and hungry."
      },
      {
        id: "B",
        text: "Parasite: Cat (+) | Host: Tapeworm (-). The cat eats the worm.",
        isCorrect: false,
        misconceptionTag: "Reversing Parasite and Host Roles",
        feedback: "Oops, you swapped them! The cat being harmed is the Host (-), and the worm stealing food inside is the Parasite (+)."
      },
      {
        id: "C",
        text: "Commensalism (+ / 0) because the worm doesn't hurt the cat.",
        isCorrect: false,
        misconceptionTag: "Thinking internal worms are harmless",
        feedback: "Tapeworms steal vital food meant for the cat, making the cat sick and thin (-). That's Parasitism (+ / -)!"
      },
      {
        id: "D",
        text: "Mutualism (+ / +) because the worm helps the cat digest food.",
        isCorrect: false,
        misconceptionTag: "Confusing Tapeworms with Good Gut Bacteria",
        feedback: "Careful! Tapeworms are harmful parasites (+ / -), not helpful bacteria."
      }
    ],
    classStats: { accuracy: 88, distractorCounts: { A: 28, B: 2, C: 1, D: 1 } }
  },
  {
    id: 6,
    code: "Q6-MUT-HERMIT",
    category: "Mutualism (+ / +)",
    bloomLevel: "Apply",
    title: "3D Beach: Hermit Crab & Sea Anemone",
    scenario: "Watch the 3D Hermit Crab walking across the sand with a pink Sea Anemone riding right on top of its shell!",
    question: "Why does the Hermit Crab carry the Sea Anemone on its shell?",
    audioScript: "Level 6! Watch the 3D Hermit Crab carrying a Sea Anemone on its shell. How do both animals help each other?",
    tags3D: [
      { icon: "🦀", name: "Hermit Crab", effect: "+ Stinging Bodyguard", color: "#4ade80" },
      { icon: "🌸", name: "Sea Anemone", effect: "+ Free Travel to Food", color: "#4ade80" }
    ],
    clue: "The anemone's stings scare away crab-eating octopuses (+), while the crab walks the anemone to new food spots (+)!",
    options: [
      {
        id: "A",
        text: "Mutualism (+ / +): Anemone's stings protect the crab, and the crab carries the anemone to food!",
        isCorrect: true,
        feedback: "Superb! The crab gets a stinging bodyguard (+), and the anemone gets a free taxi ride to more food (+)!"
      },
      {
        id: "B",
        text: "Parasitism (+ / -): The crab slowly eats the sea anemone.",
        isCorrect: false,
        misconceptionTag: "Confusing Shell Transport with Predation",
        feedback: "Not at all! The crab carefully protects its anemone partner because the anemone scares predators away (+ / +)."
      },
      {
        id: "C",
        text: "Commensalism (+ / 0): Only the crab benefits; the anemone gets nothing.",
        isCorrect: false,
        misconceptionTag: "Forgetting Sea Anemone gains mobility & scraps",
        feedback: "Remember: Sea anemones are normally stuck on one rock! Riding on the crab lets it reach way more food (+ / +)."
      },
      {
        id: "D",
        text: "Competition (- / -): Both fight to live inside the snail shell.",
        isCorrect: false,
        misconceptionTag: "Confusing Shell Sharing with Competition",
        feedback: "The crab lives INSIDE the shell while the anemone sits on TOP of the shell—they work as a team (+ / +)!"
      }
    ],
    classStats: { accuracy: 72, distractorCounts: { A: 23, B: 2, C: 6, D: 1 } }
  },
  {
    id: 7,
    code: "Q7-MATRIX-SYMBIOSIS",
    category: "Symbiosis Code Lab",
    bloomLevel: "Evaluate",
    title: "3D Crystal Lab: Match the (+ / 0 / -) Code!",
    scenario: "Spin the 3 glowing 3D Crystals! Green is Mutualism [+ / +], Blue is Commensalism [+ / 0], and Red is Parasitism [+ / -].",
    question: "Which row matches ALL THREE 3D Crystals with the right Malaysian animals & plants?",
    audioScript: "Level 7! Match the Green Plus-Plus, Blue Plus-Zero, and Red Plus-Minus crystals to the correct living things.",
    tags3D: [
      { icon: "💎", name: "Green [+ / +]", effect: "Mutualism (Both Win)", color: "#4ade80" },
      { icon: "💎", name: "Blue [+ / 0]", effect: "Commensalism (1 Wins, 1 Neutral)", color: "#38bdf8" },
      { icon: "💎", name: "Red [+ / -]", effect: "Parasitism (1 Wins, 1 Hurt)", color: "#f87171" }
    ],
    clue: "Buffalo & Mynah Bird both win [+ / +]. Wild Orchid sits harmlessly on a tree [+ / 0]. Tick sucks a dog's blood [+ / -].",
    options: [
      {
        id: "A",
        text: "[+ / +] Mynah & Buffalo  |  [+ / 0] Orchid & Tree  |  [+ / -] Tick & Dog",
        isCorrect: true,
        feedback: "Master Scientist! Mynah eats ticks off the buffalo [+ / +], Orchid perches harmlessly on bark [+ / 0], and Ticks suck dog blood [+ / -]!"
      },
      {
        id: "B",
        text: "[+ / 0] Mynah & Buffalo  |  [+ / +] Remora & Shark  |  [+ / -] Rafflesia & Vine",
        isCorrect: false,
        misconceptionTag: "Swapping Mutualism and Commensalism",
        feedback: "Oops! You swapped [+ / +] and [+ / 0]. Remember: Remora & Shark is Commensalism [+ / 0]."
      },
      {
        id: "C",
        text: "[+ / +] Mynah & Buffalo  |  [+ / 0] Rafflesia & Vine  |  [+ / -] Orchid & Tree",
        isCorrect: false,
        misconceptionTag: "Swapping Epiphyte Orchid and Parasitic Rafflesia",
        feedback: "Careful! Green Orchids make their own food [+ / 0], whereas leafless Rafflesia steals food from vines [+ / -]."
      },
      {
        id: "D",
        text: "[+ / -] Clownfish & Anemone  |  [+ / 0] Orchid & Tree  |  [+ / +] Tick & Dog",
        isCorrect: false,
        misconceptionTag: "Swapping Mutualism and Parasitism",
        feedback: "Ticks hurt dogs [+ / -], while Clownfish and Anemones help each other [+ / +]!"
      }
    ],
    classStats: { accuracy: 66, distractorCounts: { A: 21, B: 5, C: 5, D: 1 } }
  },
  {
    id: 8,
    code: "Q8-COMP-FOREST",
    category: "Plant Competition",
    bloomLevel: "Analyse",
    title: "3D Greenhouse: Crowded vs. Spaced Pots",
    scenario: "Compare the two 3D Flower Pots! Left Pot has 16 crowded, tiny yellow stems. Right Pot has 3 tall, lush green trees.",
    question: "What 4 things are the crowded young plants competing for?",
    audioScript: "Level 8! Look at the two 3D flower pots. What four basic needs are the crowded plants competing for?",
    tags3D: [
      { icon: "🥀", name: "Left Pot (Crowded)", effect: "High Competition!", color: "#facc15" },
      { icon: "🌳", name: "Right Pot (Spaced)", effect: "Plenty of Sunlight & Space", color: "#4ade80" }
    ],
    clue: "Do green plants fight for 'mates' or 'prey' like animals? No! Think of what roots and leaves need.",
    options: [
      {
        id: "A",
        text: "Sunlight, water, soil nutrients, and space.",
        isCorrect: true,
        feedback: "Bingo! Plants compete for 4 key needs: Sunlight, Water, Soil Nutrients (minerals), and Space for roots & leaves!"
      },
      {
        id: "B",
        text: "Sunlight, water, mates, and territory.",
        isCorrect: false,
        misconceptionTag: "Mixing up Animal Competition with Plant Competition",
        feedback: "Haha, trees don't fight over mates! Only animals compete for mates. Plants need Sunlight, Water, Nutrients, and Space."
      },
      {
        id: "C",
        text: "Prey, shelter from predators, and water.",
        isCorrect: false,
        misconceptionTag: "Thinking regular green trees hunt prey",
        feedback: "Green trees make their own food from sunlight—they don't hunt prey! They compete for Sunlight, Water, Nutrients, and Space."
      },
      {
        id: "D",
        text: "Only water, because plants don't need space or sunlight.",
        isCorrect: false,
        misconceptionTag: "Forgetting sunlight, nutrients, and space",
        feedback: "Water isn't enough! Crowded plants also fight for Sunlight, Soil Nutrients, and Space."
      }
    ],
    classStats: { accuracy: 81, distractorCounts: { A: 26, B: 4, C: 1, D: 1 } }
  },
  {
    id: 9,
    code: "Q9-PREY-OWLS",
    category: "Prey-Predator (Bio-Control)",
    bloomLevel: "Predict",
    title: "3D Plantation: Barn Owl & Rat",
    scenario: "Watch the 3D Barn Owl swooping over the oil palm estate! Farmers build owl nest boxes so owls hunt rats that eat palm fruits.",
    question: "When Barn Owls (Predators) hunt Rats (Prey), what happens to the oil palm harvest?",
    audioScript: "Level 9! Watch the 3D Barn Owl swooping down to hunt rats. When owls hunt rats in an oil palm estate, what happens to the palm fruit harvest?",
    tags3D: [
      { icon: "🦉", name: "Barn Owl", effect: "Predator (Hunts Rats)", color: "#38bdf8" },
      { icon: "🐀", name: "Plantation Rat", effect: "Prey (Decreases ↓)", color: "#f87171" }
    ],
    clue: "More Owls = Fewer Rats eating the fruits! So what happens to the amount of healthy oil palm fruits?",
    options: [
      {
        id: "A",
        text: "Rat numbers drop ↓, and healthy oil palm fruit harvest goes UP ↑ without poison!",
        isCorrect: true,
        feedback: "Brilliant prediction! Barn Owls naturally reduce rat pests ↓, so farmers harvest way more oil palm fruits ↑ safely!"
      },
      {
        id: "B",
        text: "Both rats and oil palm fruits disappear completely.",
        isCorrect: false,
        misconceptionTag: "Thinking Owls eat oil palm fruits",
        feedback: "Barn Owls are carnivores—they only eat rats, never oil palm fruits! Fewer rats means MORE palm fruits survive."
      },
      {
        id: "C",
        text: "Rats are the Predators and Owls are the Prey, so rat numbers rise ↑.",
        isCorrect: false,
        misconceptionTag: "Reversing Predator and Prey Roles",
        feedback: "Careful! The Barn Owl is the Predator that hunts the Rat (Prey), causing rat numbers to drop ↓."
      },
      {
        id: "D",
        text: "Owls and Rats become best friends in Mutualism (+ / +).",
        isCorrect: false,
        misconceptionTag: "Confusing Predation with Mutualism",
        feedback: "Owls eat rats for dinner, so that's definitely Prey-Predator, not Mutualism!"
      }
    ],
    classStats: { accuracy: 75, distractorCounts: { A: 24, B: 4, C: 3, D: 1 } }
  },
  {
    id: 10,
    code: "Q10-BOSS-ECOSYSTEM",
    category: "🏆 FINAL BOSS STAGE",
    bloomLevel: "Evaluate & Diagnose",
    title: "3D Golden Island: Chief Ecologist Trophy!",
    scenario: "Spin the 3D Golden Trophy! To win your Chief Ecologist Crown, pick the ONLY report below that is 100% scientifically true!",
    question: "FINAL BOSS: Which wildlife report is 100% TRUE?",
    audioScript: "Final Boss Level! Spin the golden trophy and choose the only wildlife report that is one hundred percent scientifically true!",
    tags3D: [
      { icon: "🏆", name: "Golden Trophy", effect: "+250 BONUS XP!", color: "#facc15" },
      { icon: "👑", name: "Final Boss", effect: "Prove Your Mastery!", color: "#4ade80" }
    ],
    clue: "Remember what you learned in Level 3: Bird's Nest Fern is Commensalism (+ / 0), while Mistletoe (Dedalu) is a Parasite (+ / -)!",
    options: [
      {
        id: "A",
        text: "Bird's Nest Fern on an oil palm is Parasitism (+ / -).",
        isCorrect: false,
        misconceptionTag: "Calling Bird's Nest Fern a parasite",
        feedback: "Remember Level 3! Bird's Nest Fern makes its own food with green leaves—it is Commensalism (+ / 0), not a parasite!"
      },
      {
        id: "B",
        text: "Mistletoe on a mango tree is Parasitism (+ / -), and Barnacles on a whale are Commensalism (+ / 0).",
        isCorrect: true,
        feedback: "CHAMPION ECOLOGIST! 🏆 Mistletoe steals sap from trees (+ / -), and Barnacles get a free ride on whales without hurting them (+ / 0)!"
      },
      {
        id: "C",
        text: "Trees compete for mates, and two tigers fighting is Interspecific Competition.",
        isCorrect: false,
        misconceptionTag: "Confusing Plant & Animal Competition",
        feedback: "Plants never compete for mates, and two tigers are the SAME species (Intraspecific)!"
      },
      {
        id: "D",
        text: "Ticks sucking blood from a cat is Commensalism (+ / 0).",
        isCorrect: false,
        misconceptionTag: "Thinking blood-sucking ticks don't harm hosts",
        feedback: "Ticks suck blood and make the cat sick (-), so Ticks on a cat are Parasitism (+ / -)!"
      }
    ],
    classStats: { accuracy: 59, distractorCounts: { A: 8, B: 19, C: 3, D: 2 } }
  }
];

const CLASS_ROSTER_DATA = [
  { id: "S01", name: "Ahmad Danial", preScore: 70, postRedemption: 90, flaggedQ: ["Q3 (Bird's Nest Fern)"], misconception: "Fern vs Parasite" },
  { id: "S02", name: "Aisyah Humaira", preScore: 90, postRedemption: 100, flaggedQ: ["Q2 (Remora & Shark)"], misconception: "Remora Mutualism" },
  { id: "S03", name: "Amirul Hakim", preScore: 50, postRedemption: 90, flaggedQ: ["Q2", "Q3"], misconception: "Commensalism (+/0)" },
  { id: "S04", name: "Brendan Lim", preScore: 80, postRedemption: 100, flaggedQ: ["Q3 (Bird's Nest Fern)"], misconception: "Fern vs Parasite" },
  { id: "S05", name: "Chong Wei Ting", preScore: 100, postRedemption: 100, flaggedQ: [], misconception: "All Mastered! 🌟" },
  { id: "S06", name: "Darshini a/p Rajan", preScore: 60, postRedemption: 90, flaggedQ: ["Q2", "Q3"], misconception: "Commensalism (+/0)" },
  { id: "S07", name: "Farah Nabila", preScore: 70, postRedemption: 90, flaggedQ: ["Q2 (Remora & Shark)"], misconception: "Remora Mutualism" },
  { id: "S08", name: "Harith Iskandar", preScore: 50, postRedemption: 90, flaggedQ: ["Q2", "Q3", "Q10"], misconception: "Fern vs Parasite" }
];
