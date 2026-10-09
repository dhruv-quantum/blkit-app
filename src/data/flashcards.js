// Flashcard guide content. The flashcards themselves stay physical (in the box);
// the app only explains how to use them. Keyed by kit id.
//
// `quarter` is the quarter in which a deck is easiest to start with. It follows
// the same framework as the activities: Q1 look & name, Q2 one-step motor,
// Q3 sort & order, Q4 build & imagine.

export const FLASHCARD_GUIDES = {
  nursery: {
    title: "Flashcard Guide",
    intro:
      "Your box includes physical flashcard decks. They work best in your hands, on the floor and in short, playful bursts, so we have kept them out of the app. Use this guide to know which deck to start with and how to play.",
    tips: [
      "Keep sessions short: 5 to 10 minutes, a few times a week.",
      "Start with 3 to 5 cards and add new ones only when the child knows the first few.",
      "Say the word clearly, then pause. Let the child answer before you correct.",
      "Stop while it is still fun. Leave the cards where the child can see them.",
    ],
    games: [
      {
        id: "name-it",
        title: "Name It",
        quarter: 1,
        focus: "Vocabulary & speaking",
        steps: [
          "Hold up one card at a time.",
          "Say the name together, then let the child say it alone.",
          "Add one fact: its colour, its sound, or what it does.",
        ],
      },
      {
        id: "find-it",
        title: "Find It",
        quarter: 1,
        focus: "Listening & recognition",
        steps: [
          "Lay 3 or 4 cards face up on the floor.",
          "Say a name and ask the child to point to it, or pick it up.",
          "Clap together for a correct pick, then add one more card.",
        ],
      },
      {
        id: "act-it-out",
        title: "Act It Out",
        quarter: 1,
        focus: "Movement & expression",
        steps: [
          "Pick an action or animal card without showing the child.",
          "Act it out, and let the child guess.",
          "Swap roles: the child acts, you guess.",
        ],
      },
      {
        id: "pair-up",
        title: "Match and Pair",
        quarter: 2,
        focus: "Matching & concentration",
        steps: [
          "Use two matching items such as a card and a real object, or opposite cards.",
          "Place one set on the table and give the child the other.",
          "Let the child find each match and say both names aloud.",
        ],
      },
      {
        id: "sort-it",
        title: "Sort It",
        quarter: 3,
        focus: "Sorting & reasoning",
        steps: [
          "Mix cards from two decks, for example animals and fruits.",
          "Draw two circles on the floor with chalk or string.",
          "Let the child put each card in the right circle and tell you why.",
        ],
      },
      {
        id: "whats-missing",
        title: "What's Missing?",
        quarter: 3,
        focus: "Memory & observation",
        steps: [
          "Lay out 4 cards and let the child look carefully.",
          "Ask the child to close their eyes and quietly take one away.",
          "Let the child open their eyes and tell you which one is missing.",
        ],
      },
      {
        id: "story-line",
        title: "Tell a Story",
        quarter: 4,
        focus: "Imagination & sequencing",
        steps: [
          "Pick 3 cards, such as a fruit, an animal and a place.",
          "Make up a short story using all three, and invite the child to add a line.",
          "Put the cards in order as you tell it, then retell it together.",
        ],
      },
    ],
    decks: [
      { id: "colours", name: "Colours", quarter: 1, note: "Name colours, then find them around the house." },
      { id: "shapes", name: "Shapes", quarter: 1, note: "Spot shapes in the room: plates, windows, clocks." },
      { id: "animals", name: "Animals", quarter: 1, note: "Add the animal's sound and how it moves." },
      { id: "birds", name: "Birds", quarter: 1, note: "Talk about colours, wings and sounds." },
      { id: "fruits", name: "Fruits", quarter: 1, note: "Pair with real fruit for taste, smell and touch." },
      { id: "vegetables", name: "Vegetables", quarter: 1, note: "Use at meal time, naming what is on the plate." },
      { id: "transport", name: "Transportation", quarter: 1, note: "Make the vehicle sounds together." },
      { id: "actions", name: "Actions We Do", quarter: 1, note: "Act out each action, then play the spinner game in the My Body & Feelings booklet." },
      { id: "opposites", name: "Opposites", quarter: 2, note: "Show both cards and talk about the difference." },
      { id: "numeracy", name: "Numeracy Skills", quarter: 2, note: "Count objects and match them to the card." },
      { id: "alphabets", name: "Alphabets", quarter: 2, note: "Say the letter and a word that starts with it." },
      { id: "tracing", name: "Tracing Cards", quarter: 2, note: "Trace with a finger first, then a crayon. Slip in a transparent sheet to reuse." },
      { id: "insects", name: "Insects", quarter: 2, note: "Pair with the Insects activities in the Animals booklet." },
      { id: "feelings", name: "Feelings", quarter: 2, note: "Ask: when do you feel this way? Pair with the Feelings Dice." },
      { id: "seasons", name: "Seasons", quarter: 3, note: "Sort clothes and weather by season." },
      { id: "helpers", name: "Helpers", quarter: 3, note: "Ask how each helper helps us." },
      { id: "habits", name: "Good Habits", quarter: 3, note: "Talk about your own routine, step by step." },
      { id: "week", name: "Days of the Week", quarter: 3, note: "Put the cards in order. Sing the Days of the Week rhyme." },
      { id: "months", name: "Months", quarter: 4, note: "Order the months and link them to birthdays and festivals." },
      { id: "festivals", name: "Festivals", quarter: 4, note: "Pair with the Festivals booklet activities." },
    ],
  },
};

export function getFlashcardGuide(kitId) {
  return FLASHCARD_GUIDES[kitId] ?? null;
}
