// ============================================================================
// Content data for the Brainy Ladder Kit Companion.
//
// This file is the one place a non-developer needs to touch to add new
// content. See README.md ("Adding content") for a walkthrough.
// ============================================================================

// Growth-stage framework: four quarters of increasing developmental demand
// (how much cutting/assembly the child does themselves, and how abstract the
// matching task is), used to sequence activities across the kit year.
export const QUARTERS = [
  {
    id: 1,
    name: "Quarter 1",
    focus: "Sense & Say",
    months: "Months 1–3",
    blurb:
      "Sensory play and first words. Materials arrive pre-cut — your child's job is to notice, name, and match.",
  },
  {
    id: 2,
    name: "Quarter 2",
    focus: "Trace & Match",
    months: "Months 4–6",
    blurb:
      "Guided fine-motor practice: tracing a path, or matching a concept like a missing part or an animal's home.",
  },
  {
    id: 3,
    name: "Quarter 3",
    focus: "Cut & Create",
    months: "Months 7–9",
    blurb:
      "Your child picks up the scissors (with supervision) — cutting, assembling, and linking recognition to role-play.",
  },
  {
    id: 4,
    name: "Quarter 4",
    focus: "Build & Imagine",
    months: "Months 10–12",
    blurb:
      "Capstone activities that call for abstract thinking and multi-step creativity, building on a year of practice.",
  },
];

// The one fully-loaded booklet. Each activity carries a `quarter` (1-4) and a
// `theme` tag. Several activities share the same printed `sheetImage` because
// one physical page in the kit covers two activities.
export const ANIMALS_BOOKLET = {
  id: "animals",
  name: "Animals",
  unlocked: true,
  tagline: "Explore a world of playful discovery",
  cover: "/images/sheets/cover.jpg",
  activities: [
    {
      id: "a2",
      title: "Find My Correct Part",
      theme: "Wild Animals",
      quarter: 1,
      sheetImage: "/images/sheets/wild-1.jpg",
      sheetLabel: "Sheet 1 · Activities 1–2",
      focus: "Fine motor control & concentration",
      materials: ["Fish cut-outs", "Scissors", "Tray"],
      steps: [
        "Cut out the animal images, mix them in a tray, and provide them to the child.",
        "Instruct the child to match individual cutouts to the corresponding fish scale pictures.",
        "Repeat for reinforcement to build fine motor control, concentration, and coordination.",
      ],
      videoUrl: null,
    },
    {
      id: "b1",
      title: "Bird Flash Cards",
      theme: "Birds",
      quarter: 1,
      sheetImage: "/images/sheets/birds-1.jpg",
      sheetLabel: "Sheet 1 · Activities 1–2",
      focus: "Vocabulary building & bird awareness",
      materials: ["Bird flash / resource cards"],
      steps: [
        "Hold up each card, read the bird's name aloud, and have the child repeat it.",
        "Show the bird picture and let the child guess the correct name.",
      ],
      videoUrl: null,
    },
    {
      id: "b3",
      title: "Hand Painting – Bird",
      theme: "Birds",
      quarter: 1,
      sheetImage: "/images/sheets/birds-2.jpg",
      sheetLabel: "Sheet 2 · Activities 3–4",
      focus: "Sensory & visual growth",
      materials: ["Watercolors", "Brush", "Sketch pens", "Resource card", "Paint tray"],
      steps: [
        "Pour watercolors into a tray and brush paint onto the child's hand.",
        "Press the painted hand onto the resource card and let it dry completely.",
        "Use sketch pens to draw the bird's eye, mouth, and beak.",
      ],
      videoUrl: null,
    },

    {
      id: "a3",
      title: "Animal Maze Game",
      theme: "Wild Animals",
      quarter: 2,
      sheetImage: "/images/sheets/wild-2.jpg",
      sheetLabel: "Sheet 2 · Activities 3–4",
      focus: "Concentration & spatial problem-solving",
      materials: ["Maze sheet", "Crayon"],
      steps: [
        "Introduce the maze with excitement and discuss where each animal lives.",
        "Have the child use a crayon to guide each animal to its correct home.",
      ],
      videoUrl: null,
    },
    {
      id: "a5",
      title: "Join the Missing Part",
      theme: "Wild Animals",
      quarter: 2,
      sheetImage: "/images/sheets/wild-3.jpg",
      sheetLabel: "Sheet 3 · Activities 5–6",
      focus: "Language, concentration & memory",
      materials: ["Animal cards", "Safety scissors", "Glue"],
      steps: [
        "Show the animal cards to the child, then carefully cut out along the dashed lines.",
        "Mix the cutouts, have the child name the animal, and match the missing part.",
      ],
      videoUrl: null,
    },
    {
      id: "b4",
      title: "Find My Home",
      theme: "Birds",
      quarter: 2,
      sheetImage: "/images/sheets/birds-2.jpg",
      sheetLabel: "Sheet 2 · Activities 3–4",
      focus: "Imagination & recall",
      materials: ["Bird and nest resource cards", "Scissors (adult use)"],
      steps: [
        "Carefully cut the birds and nests along the dashed lines provided.",
        "Discuss nests with the child and let them match each bird to its home.",
      ],
      videoUrl: null,
    },

    {
      id: "a1",
      title: "Animal Mask",
      theme: "Wild Animals",
      quarter: 3,
      sheetImage: "/images/sheets/wild-1.jpg",
      sheetLabel: "Sheet 1 · Activities 1–2",
      focus: "Recognition, naming & imaginative role-play",
      materials: ["Animal mask cut-outs", "Scissors", "Ribbon or thread"],
      steps: [
        "Cut along the dashed lines and tie ribbon or thread through the side holes.",
        "Show the masks to the child and have them identify each animal by name.",
        "Play animal sounds while the child wears the mask and acts like the creature.",
      ],
      videoUrl: null,
    },
    {
      id: "a4",
      title: "Animal Puzzle",
      theme: "Wild Animals",
      quarter: 3,
      sheetImage: "/images/sheets/wild-2.jpg",
      sheetLabel: "Sheet 2 · Activities 3–4",
      focus: "Language, concentration & memory",
      materials: ["Animal cards", "Scissors"],
      steps: [
        "Show the animal cards, then carefully cut them along the dashed lines.",
        "Let the child imagine and join the parts while speaking the animal's name.",
      ],
      videoUrl: null,
    },
    {
      id: "v7",
      title: "Vegetable Sorting & Matching",
      theme: "Vegetables",
      quarter: 3,
      sheetImage: "/images/sheets/veg-1.jpg",
      sheetLabel: "Sheet 1 · Activity 7",
      focus: "Fine motor development & cognitive growth",
      materials: ["Scissors", "Vegetable cut-outs", "Box or tray"],
      steps: [
        "Cut the vegetable images along the dashed lines and mix them into a tray or box.",
        "Have the child draw out cut-outs one by one to match with the corresponding picture.",
        "Repeat the game several times to help the child solidify vegetable recognition.",
      ],
      videoUrl: null,
    },

    {
      id: "a6",
      title: "Half Part Animal Matching",
      theme: "Wild Animals",
      quarter: 4,
      sheetImage: "/images/sheets/wild-3.jpg",
      sheetLabel: "Sheet 3 · Activities 5–6",
      focus: "Recognition & vocabulary",
      materials: ["Animal resource cards", "Safety scissors", "Glue"],
      steps: [
        "Cut the animal cards along the dashed lines and mix the pieces before giving them to the child.",
        "Let the child use their imagination to find and match the animal body parts.",
      ],
      videoUrl: null,
    },
    {
      id: "b2",
      title: "Craft and Assembly",
      theme: "Birds",
      quarter: 4,
      sheetImage: "/images/sheets/birds-1.jpg",
      sheetLabel: "Sheet 1 · Activities 1–2",
      focus: "Fine motor skills & imaginative roleplay",
      materials: ["Resource cards", "Colors", "Scissors", "Craft tape"],
      steps: [
        "Cut out along the dashed lines, color the pieces, and assemble the bird craft.",
        'Wear the finished puppets and let the birds "fly" and interact together.',
      ],
      videoUrl: null,
    },
  ],
};

// Locked placeholder booklets — real category names pulled from the product
// listing ("Early Literacy Skills", "Early Numeracy Skills", "Social &
// Emotional Development"). Content not yet loaded into this app.
export const LOCKED_BOOKLETS = [
  { id: "literacy", name: "Early Literacy" },
  { id: "numeracy", name: "Early Numeracy" },
  { id: "social", name: "Social & Emotional" },
];

// ----------------------------------------------------------------------------
// The 5 real kits. Each `id` here MUST match the `id` used in Supabase's
// `kits` table (see supabase/schema.sql) — that's how a parent's granted
// kit_access rows map back to content in this file. `contentReady: false`
// means the kit exists as a real product but its activities haven't been
// loaded into the app yet (distinct from a parent simply not having access
// to it — see components/KitCard's two different locked states).
// ----------------------------------------------------------------------------
export const KITS = [
  {
    id: "playgroup",
    name: "The Brain Train",
    ageGroup: "Playgroup",
    contentReady: false,
    booklets: [],
  },
  {
    id: "nursery",
    name: "The Brainy Badgers",
    ageGroup: "Nursery",
    contentReady: true,
    price: "₹2,999",
    introVideo: "https://www.youtube.com/embed/truXC-F4Wrk",
    blurb:
      "A single year-long box of 350+ worksheets and activity sheets covering early literacy, numeracy, birds & animals, and social-emotional play — no screens required.",
    stats: ["350+ activities", "4 skill areas", "Ages 1.5+"],
    booklets: [ANIMALS_BOOKLET, ...LOCKED_BOOKLETS],
  },
  {
    id: "kg1",
    name: "The Rapid Learners",
    ageGroup: "KG–I",
    contentReady: false,
    booklets: [],
  },
  {
    id: "kg2",
    name: "The Clever Buds",
    ageGroup: "KG–II",
    contentReady: false,
    booklets: [],
  },
  {
    id: "phonics",
    name: "Phonics Learning Kit",
    ageGroup: "All ages",
    contentReady: false,
    booklets: [],
  },
];

// The one add-on product — not tied to an age group, purchasable alongside
// any kit.
export const ADDONS = [{ id: "flashcards", name: "Flashcards" }];

export function getKitById(id) {
  return KITS.find((k) => k.id === id) || null;
}

export function getBookletById(kit, bookletId) {
  if (!kit) return null;
  return kit.booklets.find((b) => b.id === bookletId && b.unlocked) || null;
}

export function activitiesForQuarter(booklet, quarterId) {
  return booklet.activities.filter((a) => a.quarter === quarterId);
}

export function quarterCounts(booklet) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  booklet.activities.forEach((a) => {
    counts[a.quarter] = (counts[a.quarter] || 0) + 1;
  });
  return counts;
}
