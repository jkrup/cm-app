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
import { EmotionalState } from '@/app/store/mammothStore';

export type MoodLevel = 'happy' | 'content' | 'bored' | 'sad' | 'playful' | 'hungry' | 'angry' | 'sleepy' | 'excited' | 'grumpy' | 'agitated' | 'lethargic';

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
  'grumpy': null,
  'agitated': null,
  'lethargic': null
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
  energy: number;
  happiness: number;
  hunger?: number;
  boredom?: number;
  affection?: number;
  isFeeding?: boolean;
  emotionalState?: EmotionalState;
}

export function getMammothMood({
  energy,
  happiness,
  hunger = 50,
  boredom = 50,
  affection = 50,
  isFeeding = false,
  emotionalState
}: MoodParams): MammothMood {
  // Hunger messages
  const hungryTexts = [
    `${MAMMOTH_NAME} is eagerly awaiting her tasty treats`,
    `${MAMMOTH_NAME} is sad that you've forgotten to feed her lunch`,
    `${MAMMOTH_NAME} is ready to eat! She wants her food NOW!`
  ];
  
  // Playful messages (High Energy + High Happiness)
  const playfulTexts = [
    `${MAMMOTH_NAME} is feeling excited and energetic! Time for a new game!`,
    `${MAMMOTH_NAME} is brimming with confidence! She's ready to win!`,
    `${MAMMOTH_NAME} is bouncing with joy! She wants to play with you!`
  ];
  
  // Content messages (Low Energy + High Happiness)
  const contentTexts = [
    `${MAMMOTH_NAME} is content with life right now`,
    `${MAMMOTH_NAME} feels pretty good about things`,
    `${MAMMOTH_NAME} is relaxed and enjoying your company`
  ];
  
  // Agitated messages (High Energy + Low Happiness)
  const agitatedTexts = [
    `${MAMMOTH_NAME} is restless and irritable. Something's bothering her.`,
    `${MAMMOTH_NAME} can't sit still. She's pacing back and forth anxiously.`,
    `${MAMMOTH_NAME} is full of energy but seems unhappy about something.`
  ];
  
  // Lethargic messages (Low Energy + Low Happiness)
  const lethargicTexts = [
    `${MAMMOTH_NAME} is feeling down and has no energy to do anything.`,
    `${MAMMOTH_NAME} looks sad and tired. Perhaps she needs some care.`,
    `${MAMMOTH_NAME} is barely moving. She seems depressed and exhausted.`
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
  
  // Bored messages
  const boredTexts = [
    `${MAMMOTH_NAME} is getting a bit bored. Play with her?`,
    `${MAMMOTH_NAME} is tapping her foot, waiting for something exciting to happen`,
    `${MAMMOTH_NAME} wonders what you're up to. She's looking for entertainment`
  ];
  
  // Angry messages
  const angryTexts = [
    `${MAMMOTH_NAME} can't contain herself, she's so mad!`,
    `${MAMMOTH_NAME} wants a rematch! No fair!`,
    `This food is not what she wanted! ${MAMMOTH_NAME} demands more NOW!`
  ];
  
  // Sad messages
  const sadTexts = [
    `${MAMMOTH_NAME} is really sad that you've been gone so long`,
    `${MAMMOTH_NAME} is down in the dumps. Where have you been?`,
    `${MAMMOTH_NAME} is sad that she lost the game. Give her a treat?`
  ];
  
  if (isFeeding) {
    return {
      level: 'hungry',
      text: getRandomText(hungryTexts, 'hungry'),
      expression: prefeedingMammothImg,
      bounceAnimation: ''
    };
  }
  
  // Very low energy always results in sleepy mammoth
  if (energy < 15) {
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
  
  // If we have a valid emotional state, use it to determine the mood
  if (emotionalState) {
    switch (emotionalState) {
      case 'playful': // High Energy + High Happiness
        return {
          level: 'playful',
          text: getRandomText(playfulTexts, 'playful'),
          expression: playingMammothImg,
          bounceAnimation: 'animate-bounce'
        };
        
      case 'agitated': // High Energy + Low Happiness
        return {
          level: 'agitated',
          text: getRandomText(agitatedTexts, 'agitated'),
          expression: angryMammothImg,
          bounceAnimation: 'animate-bounce-small'
        };
        
      case 'content': // Low Energy + High Happiness
        return {
          level: 'content',
          text: getRandomText(contentTexts, 'content'),
          expression: friendlyMammothImg,
          bounceAnimation: 'animate-bounce-small'
        };
        
      case 'lethargic': // Low Energy + Low Happiness
        return {
          level: 'lethargic',
          text: getRandomText(lethargicTexts, 'lethargic'),
          expression: sadMammothImg,
          bounceAnimation: ''
        };
    }
  }
  
  // High boredom but high energy leads to anger - mammoth is frustrated
  if (boredom > 75 && energy > 70) {
    return {
      level: 'angry',
      text: getRandomText(angryTexts, 'angry'),
      expression: angryMammothImg,
      bounceAnimation: 'animate-bounce-small'
    };
  }
  
  // Very high energy and happiness - mammoth is super happy
  if (energy > 85 && happiness > 85) {
    return {
      level: 'excited',
      text: getRandomText(excitedTexts, 'excited'),
      expression: playingMammothImg,
      bounceAnimation: 'animate-bounce'
    };
  }
  
  // High energy - mammoth wants to play
  if (energy > 75) {
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
  const avgMood = (energy + happiness) / 2;
  
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