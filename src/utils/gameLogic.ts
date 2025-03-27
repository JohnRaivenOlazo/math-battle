// Calculate the Russian Peasant Multiplication
export const calculateRussianPeasant = (a: number, b: number): { 
  steps: Array<{left: number, right: number, include: boolean}>,
  result: number
} => {
  let left = Math.floor(a);  // Ensure we start with integers
  let right = Math.floor(b);
  const steps: Array<{left: number, right: number, include: boolean}> = [];
  let result = 0;

  // Keep going until left becomes 0
  while (left > 0) {
    const include = left % 2 !== 0;  // Include only when left is odd
    steps.push({ left, right, include });
    
    if (include) {
      result += right;
    }
    
    left = Math.floor(left / 2);  // Ensure proper halving with floor
    right = right * 2;  // Double the right value
  }

  return { steps, result };
};

// Generate random numbers for multiplication with better distribution
export const generateNumbers = (difficulty: 'easy' | 'medium' | 'hard'): [number, number] => {
  let a, b;
  
  switch (difficulty) {
    case 'easy':
      // More focused range for easier numbers
      a = Math.floor(Math.random() * 8) + 3; // 3-10
      b = Math.floor(Math.random() * 8) + 3; // 3-10
      break;
    case 'medium':
      // Interesting medium difficulty numbers
      a = Math.floor(Math.random() * 18) + 12; // 12-29
      b = Math.floor(Math.random() * 8) + 5; // 5-12
      break;
    case 'hard':
    default:
      // More challenging numbers with larger binary representations
      a = Math.floor(Math.random() * 40) + 30; // 30-69
      b = Math.floor(Math.random() * 15) + 10; // 10-24
      // Occasionally use prime numbers for more challenge
      if (Math.random() < 0.3) {
        const primes = [31, 37, 41, 43, 47, 53, 59, 61, 67];
        a = primes[Math.floor(Math.random() * primes.length)];
      }
      break;
  }
  
  return [a, b];
};

// Enhanced damage calculation with critical hits and more interesting scaling
export const calculateDamage = (a: number, b: number, timeBonus: number): { 
  damage: number, 
  isCritical: boolean,
  bonusDamage: number 
} => {
  // Base damage from the difficulty of the problem
  const baseDamage = Math.ceil(Math.sqrt(a * b) / 1.8);
  
  // Time bonus damage
  const timeBonusDamage = timeBonus * 1.5;
  
  // Critical hit system (more likely with better time)
  const criticalChance = 0.15 + (timeBonus / 20); // Max 65% with full time bonus
  const isCritical = Math.random() < criticalChance;
  const criticalMultiplier = isCritical ? 1.5 : 1;
  
  // Calculate final damage with floor/ceiling
  const calculatedDamage = Math.floor((baseDamage + timeBonusDamage) * criticalMultiplier);
  const finalDamage = Math.max(8, Math.min(35, calculatedDamage));
  
  // Calculate bonus damage from time and critical
  const bonusDamage = Math.floor(timeBonusDamage + (isCritical ? baseDamage * 0.5 : 0));
  
  return { 
    damage: finalDamage, 
    isCritical, 
    bonusDamage 
  };
};

// Enhanced score calculation with combos and multipliers
export const calculateScore = (
  damage: number, 
  timeBonus: number, 
  streak: number,
  isCritical: boolean
): { score: number, multiplier: number } => {
  // Base score from damage
  const baseScore = damage * 10;
  
  // Time bonus
  const timeScore = timeBonus * 8;
  
  // Streak multiplier (increases with each correct answer)
  const multiplier = Math.min(4, 1 + (streak * 0.25));
  
  // Critical bonus
  const criticalBonus = isCritical ? 50 : 0;
  
  // Calculate final score
  const finalScore = Math.floor((baseScore + timeScore + criticalBonus) * multiplier);
  
  return { score: finalScore, multiplier };
};

// Check if selected rows are correct for Russian Peasant Multiplication
export const checkSelectedRows = (
  selectedIndices: number[], 
  steps: Array<{left: number, right: number, include: boolean}>
): boolean => {
  // Get indices of rows that should be included
  const correctIndices = steps
    .map((step, index) => step.include ? index : -1)
    .filter(index => index !== -1);
  
  // Sort both arrays to ensure order doesn't matter
  const sortedSelected = [...selectedIndices].sort((a, b) => a - b);
  const sortedCorrect = [...correctIndices].sort((a, b) => a - b);
  
  if (sortedSelected.length !== sortedCorrect.length) {
    return false;
  }
  
  // Check if each index matches
  return sortedSelected.every((index, i) => index === sortedCorrect[i]);
};

// Get feedback on why answer was wrong
export const getAnswerFeedback = (
  selectedIndices: number[],
  steps: Array<{left: number, right: number, include: boolean}>
): string => {
  const correctIndices = steps
    .map((step, index) => step.include ? index : -1)
    .filter(index => index !== -1);
  
  const missingIndices = correctIndices.filter(index => !selectedIndices.includes(index));
  const extraIndices = selectedIndices.filter(index => !correctIndices.includes(index));
  
  if (missingIndices.length > 0 && extraIndices.length === 0) {
    return "You missed some rows with odd numbers on the left.";
  } else if (extraIndices.length > 0 && missingIndices.length === 0) {
    return "You selected some rows with even numbers on the left.";
  } else {
    return "Remember to only select rows where the left number is odd.";
  }
};

// Types for game state
export type GameState = 'intro' | 'playing' | 'checking' | 'correct' | 'wrong' | 'opponentTurn' | 'victory' | 'defeat';

export type Character = {
  name: string;
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  level: number; // Added level property
  specialMeter: number; // Special attack meter
};

// Enhanced character creation with more interesting stats
export const createCharacter = (name: string, difficulty: 'easy' | 'medium' | 'hard'): Character => {
  let maxHealth, attack, defense, level;
  
  switch (difficulty) {
    case 'easy':
      level = 1;
      maxHealth = 100;
      attack = 10;
      defense = 5;
      break;
    case 'medium':
      level = 3;
      maxHealth = 150;
      attack = 15;
      defense = 8;
      break;
    case 'hard':
    default:
      level = 5;
      maxHealth = 200;
      attack = 20;
      defense = 12;
      break;
  }
  
  return {
    name,
    maxHealth,
    currentHealth: maxHealth,
    attack,
    defense,
    level,
    specialMeter: 0 // Start with empty special meter
  };
};

// Update special meter after correct answer
export const updateSpecialMeter = (
  character: Character, 
  isCorrect: boolean, 
  timeBonus: number
): Character => {
  let specialMeter = character.specialMeter;
  
  if (isCorrect) {
    // Increase special meter based on time bonus
    specialMeter += 20 + timeBonus;
    
    // Cap at 100
    specialMeter = Math.min(100, specialMeter);
  } else {
    // Decrease slightly on incorrect answers
    specialMeter = Math.max(0, specialMeter - 10);
  }
  
  return {
    ...character,
    specialMeter
  };
};

// Use special attack when meter is full
export const useSpecialAttack = (
  character: Character
): { character: Character, damageMultiplier: number } => {
  if (character.specialMeter < 100) {
    return { character, damageMultiplier: 1 };
  }
  
  // Reset special meter and return damage multiplier
  return {
    character: {
      ...character,
      specialMeter: 0
    },
    damageMultiplier: 2.5 // Special attacks do 2.5x damage
  };
};

// Level up character after defeating an opponent
export const levelUpCharacter = (character: Character): Character => {
  const newLevel = character.level + 1;
  
  return {
    ...character,
    level: newLevel,
    maxHealth: Math.floor(character.maxHealth * 1.2),
    currentHealth: Math.floor(character.maxHealth * 1.2), // Fully heal on level up
    attack: Math.floor(character.attack * 1.15),
    defense: Math.floor(character.defense * 1.1)
  };
};
