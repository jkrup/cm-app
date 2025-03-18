import happyMammothImg from '@/public/mammoth/happy.png';
import mediumMammothImg from '@/public/mammoth/medium.png';
import lowMammothImg from '@/public/mammoth/low.png';
import sadMammothImg from '@/public/mammoth/sad.png';
import sleepingMammothImg from '@/public/mammoth/sleeping.png';
import playingMammothImg from '@/public/mammoth/playing.png';
// Import mood-specific images
import angryMammothImg from '@/public/mammoth/moods/angry.png';
import friendlyMammothImg from '@/public/mammoth/moods/friendly.png';
import grumpyMammothImg from '@/public/mammoth/moods/grumpy.png';
import playfulMammothImg from '@/public/mammoth/moods/playful.png';
import prefeedingMammothImg from '@/public/mammoth/moods/prefeed.png';

// Import the MAMMOTH_NAME constant
import { MAMMOTH_NAME } from '@/app/constants/mammoth';

export type MoodLevel = 'happy' | 'content' | 'bored' | 'sad' | 'playful' | 'hungry' | 'angry' | 'sleepy' | 'excited' | 'grumpy';

export interface MammothMood {
  level: MoodLevel;
  text: string;
  expression: any; // Using any for the image import type
  bounceAnimation: string;
}

// Cache the last selected text to avoid repetition
let lastTexts: Record<MoodLevel, string | null> = {
  'happy': null,
  'content': null,
  'bored': null,
  'sad': null,
  'playful': null,
  'hungry': null,
  'angry': null,
  'sleepy': null,
  'excited': null,
  'grumpy': null
};

// Helper function to get a random text that's different from the last one
const getRandomText = (texts: string[], moodLevel: MoodLevel): string => {
  // Filter out the last text if there are multiple options
  const filteredTexts = texts.length > 1 && lastTexts[moodLevel] 
    ? texts.filter(text => text !== lastTexts[moodLevel]) 
    : texts;
  
  // Get a random text
  const randomIndex = Math.floor(Math.random() * filteredTexts.length);
  const selectedText = filteredTexts[randomIndex];
  
  // Update the last text cache
  lastTexts[moodLevel] = selectedText;
  
  return selectedText;
};

interface MoodParams {
  excitement: number;
  happiness: number;
  hunger?: number;
  energy?: number;
  boredom?: number;
  affection?: number;
  isFeeding?: boolean;
}

export function getMammothMood({
  excitement,
  happiness,
  hunger = 50,
  energy = 50,
  boredom = 50,
  affection = 50,
  isFeeding = false
}: MoodParams): MammothMood {
  const avgMood = (excitement + happiness) / 2;
  
  // Hunger messages
  const hungryTexts = [
    `${MAMMOTH_NAME} is eagerly awaiting her tasty treats`,
    `${MAMMOTH_NAME} is sad that you've forgotten to feed her lunch`,
    `${MAMMOTH_NAME} is ready to eat! She wants her food NOW!`
  ];
  
  // Playful messages
  const playfulTexts = [
    `${MAMMOTH_NAME} is feeling excited and energetic! Time for a new game!`,
    `${MAMMOTH_NAME} is brimming with confidence! She's ready to win!`,
    `${MAMMOTH_NAME} misses you and wants you to hang out with her`
  ];
  
  // Sad messages
  const sadTexts = [
    `${MAMMOTH_NAME} is really sad that you've been gone so long`,
    `${MAMMOTH_NAME} is down in the dumps. Where have you been?`,
    `${MAMMOTH_NAME} is sad that she lost the game. Give her a treat?`
  ];
  
  // Angry messages
  const angryTexts = [
    `${MAMMOTH_NAME} can't contain herself, she's so mad!`,
    `${MAMMOTH_NAME} wants a rematch! No fair!`,
    `This food is not what she wanted! ${MAMMOTH_NAME} demands more NOW!`
  ];
  
  // Sleepy messages
  const sleepyTexts = [
    `Hmmmmm maybe it's time for a nap…hmmmmm`,
    `${MAMMOTH_NAME} is tired after all that winning, time for a victory nap`,
    `${MAMMOTH_NAME} can barely keep her eyes open, time to tuck her in`
  ];
  
  // Excited messages
  const excitedTexts = [
    `OH WOW OH WOW ${MAMMOTH_NAME} IS SO EXCITED TO SEE YOU`,
    `${MAMMOTH_NAME} can't stay still, she's so happy!`,
    `All the glaciers in the world won't stop ${MAMMOTH_NAME} from giving you a big hug!`
  ];
  
  // Content messages
  const contentTexts = [
    `${MAMMOTH_NAME} is content with life right now`,
    `${MAMMOTH_NAME} feels pretty good about things`,
    `${MAMMOTH_NAME} is relaxing and enjoying the moment`
  ];
  
  // Bored messages
  const boredTexts = [
    `${MAMMOTH_NAME} is getting a bit bored. Play with her?`,
    `${MAMMOTH_NAME} is tapping her foot, waiting for something exciting to happen`,
    `${MAMMOTH_NAME} wonders what you're up to. She's looking for entertainment`
  ];
  
  if (isFeeding) {
    return {
      level: 'hungry',
      text: getRandomText(hungryTexts, 'hungry'),
      expression: prefeedingMammothImg,
      bounceAnimation: ''
    };
  }
  
  // Very low energy results in sleepy mammoth
  if (energy < 25) {
    return {
      level: 'sleepy',
      text: getRandomText(sleepyTexts, 'sleepy'),
      expression: sleepingMammothImg,
      bounceAnimation: ''
    };
  }
  
  // Very hungry takes precedence over most other states
  if (hunger < 20) {
    return {
      level: 'hungry',
      text: getRandomText(hungryTexts, 'hungry'),
      expression: grumpyMammothImg,
      bounceAnimation: hunger < 10 ? '' : 'animate-bounce-small'
    };
  }
  
  
  // High boredom but high excitement leads to anger - mammoth is frustrated
  if (boredom > 75 && excitement > 70) {
    return {
      level: 'angry',
      text: getRandomText(angryTexts, 'angry'),
      expression: angryMammothImg,
      bounceAnimation: 'animate-bounce-small'
    };
  }
  
  // Very high excitement and happiness - mammoth is super happy
  if (excitement > 85 && happiness > 85) {
    return {
      level: 'excited',
      text: getRandomText(excitedTexts, 'excited'),
      expression: playingMammothImg,
      bounceAnimation: 'animate-bounce'
    };
  }
  
  // High excitement and energy - mammoth wants to play
  if (excitement > 75 && energy > 60) {
    return {
      level: 'playful',
      text: getRandomText(playfulTexts, 'playful'),
      expression: playingMammothImg,
      bounceAnimation: 'animate-bounce'
    };
  }
  
  // Very high boredom makes mammoth grumpy regardless of happiness
  if (boredom > 80) {
    return {
      level: 'bored',
      text: getRandomText(boredTexts, 'bored'),
      expression: grumpyMammothImg,
      bounceAnimation: ''
    };
  }
  
  // High affection and moderate-to-high happiness - mammoth is friendly
  if (affection > 75 && happiness > 60) {
    return {
      level: 'happy',
      text: getRandomText(excitedTexts, 'happy'),
      expression: friendlyMammothImg,
      bounceAnimation: 'animate-bounce-small'
    };
  }
  
  // Fall back to standard mood calculation based on average mood
  
  // Very happy
  if (avgMood > 80) {
    return {
      level: 'happy',
      text: getRandomText(excitedTexts, 'happy'),
      expression: happyMammothImg, 
      bounceAnimation: 'animate-bounce'
    };
  }
  
  // Pretty happy
  if (avgMood > 65) {
    return {
      level: 'content',
      text: getRandomText(contentTexts, 'content'),
      expression: friendlyMammothImg,
      bounceAnimation: 'animate-bounce-small'
    };
  }
  
  // Neutral
  if (avgMood > 50) {
    return {
      level: 'content',
      text: getRandomText(contentTexts, 'content'),
      expression: mediumMammothImg,
      bounceAnimation: 'animate-bounce-small'
    };
  }
  
  // Mildly unhappy
  if (avgMood > 30) {
    return {
      level: 'bored',
      text: getRandomText(boredTexts, 'bored'),
      expression: lowMammothImg,
      bounceAnimation: ''
    };
  }
  
  // Quite unhappy
  if (avgMood > 15) {
    return {
      level: 'grumpy',
      text: getRandomText(boredTexts, 'grumpy'),
      expression: grumpyMammothImg,
      bounceAnimation: ''
    };
  }
  
  // Very unhappy
  return {
    level: 'sad',
    text: getRandomText(sadTexts, 'sad'),
    expression: sadMammothImg,
    bounceAnimation: ''
  };
} 