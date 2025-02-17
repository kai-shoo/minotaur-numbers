interface Tier {
  id: 'S' | 'A' | 'B';
  base: number;
  increment: number;
}

const tiers: Tier[] = [
  { id: 'S', base: 0.05, increment: 0.03 },
  { id: 'A', base: 0.15, increment: 0.05 },
  { id: 'B', base: 0.80, increment: -0.10 }
];

const ATTEMPTS_KEY = 'layoutAttempts';

export const getRandomNumber = () => {
  return Math.floor(Math.random() * 101);
};

export const getLayoutTier = (): string => {
  // Get current attempts from localStorage
  const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');

  // Calculate current probabilities with PRD
  const currentProbs = tiers.map(t => 
    Math.min(t.base + (t.increment * attempts), 1)
  );

  // Normalize probabilities to sum to 1
  const total = currentProbs.reduce((sum, p) => sum + p, 0);
  const normalized = currentProbs.map(p => p / total);

  // Select tier using weighted random
  const rand = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < normalized.length; i++) {
    cumulative += normalized[i];
    if (rand < cumulative) {
      // Reset attempts on successful selection
      localStorage.setItem(ATTEMPTS_KEY, '0');
      return tiers[i].id;
    }
  }

  // Increment attempts if no tier selected
  localStorage.setItem(ATTEMPTS_KEY, (attempts + 1).toString());
  return 'B'; // fallback to B tier
};
