export interface MoodContext {
  level: string;
  excitement: number;
  happiness: number;
  hunger: number;
  energy: number;
  boredom: number;
  affection: number;
  actionCount: number;
}

// Counter to track actions
let actionCounter = 0;

// Function to get the current action count
export const getActionCount = () => actionCounter;

// Function to increment the action count
export const incrementActionCount = () => {
  actionCounter += 1;
  return actionCounter;
};

// Function to reset the action count
export const resetActionCount = () => {
  actionCounter = 0;
  return actionCounter;
};

// Function to check if we should generate a custom message
export const shouldGenerateCustomMessage = () => {
  return actionCounter > 0 && actionCounter % 5 === 0;
};

// Function to generate a custom mood message using our API endpoint
export const generateCustomMoodMessage = async (
  mammothName: string,
  moodContext: MoodContext
): Promise<string | null> => {
  try {
    const response = await fetch('/api/ai-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mammothName,
        moodContext,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.warn('Error from AI mood API:', errorData);
      return null;
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error generating custom mood message:', error);
    return null;
  }
}; 