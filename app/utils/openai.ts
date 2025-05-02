export interface MoodContext {
  level: string;
  excitement: number;
  happiness: number;
  hunger: number;
  energy: number;
  boredom: number;
  affection: number;
}

import { generateAIMoodMessage } from '../actions/ai-mood';

// Function to generate a custom mood message using a server action
export const generateCustomMoodMessage = async (
  mammothName: string,
  moodContext: MoodContext
): Promise<string | null> => {
  try {
    const data = await generateAIMoodMessage(mammothName, moodContext);
    return data;
  } catch (error) {
    console.error('Error generating custom mood message:', error);
    return null;
  }
}; 