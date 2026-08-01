// Central registry of the five challenges. Adding a new escape room later
// is mostly a matter of appending an entry here and creating its page.

export interface ChallengeMeta {
  id: number;
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  icon: string;
  code: string;
}

export const CHALLENGES: ChallengeMeta[] = [
  {
    id: 1,
    slug: "vocabulary",
    path: "/challenge/1",
    title: "The Library of Whispers",
    subtitle: "Vocabulary Challenge",
    icon: "📖",
    code: "RAVEN",
  },
  {
    id: 2,
    slug: "grammar",
    path: "/challenge/2",
    title: "The Wizard's Spellbook",
    subtitle: "Grammar Challenge",
    icon: "📜",
    code: "CROWN",
  },
  {
    id: 3,
    slug: "reading",
    path: "/challenge/3",
    title: "The Ghost's Diary",
    subtitle: "Reading Comprehension",
    icon: "📔",
    code: "TOWER",
  },
  {
    id: 4,
    slug: "logic",
    path: "/challenge/4",
    title: "The Guardians' Torches",
    subtitle: "Logic Puzzle",
    icon: "🕯️",
    code: "SHIELD",
  },
  {
    id: 5,
    slug: "riddle",
    path: "/challenge/5",
    title: "The Ghost's Final Riddle",
    subtitle: "Riddle",
    icon: "👻",
    code: "GHOST",
  },
];

export function getChallenge(id: number): ChallengeMeta {
  const challenge = CHALLENGES.find((c) => c.id === id);
  if (!challenge) throw new Error(`Unknown challenge id: ${id}`);
  return challenge;
}
