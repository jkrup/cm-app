'use server';

import OpenAI from 'openai';
import { MoodContext } from '../utils/openai';

// Initialize OpenAI with API key from server environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIMoodMessage(
  mammothName: string,
  moodContext: MoodContext
): Promise<string | null> {
  try {
    if (!openai.apiKey) {
      console.error('OpenAI API key not configured');
      return null;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are generating short, fun mood messages for a virtual pet mammoth named ${mammothName}. 
          The messages should be 1-2 sentences, playful, and relevant to the mammoth's current mood and stats.
          Make references to ice age activities, prehistoric life, or mammoth behaviors.`
        },
        {
          role: "user",
          content: `Generate a quirky, fun message for my pet mammoth ${mammothName} based on these stats:
          - Current mood: ${moodContext.level}
          - Excitement level: ${moodContext.excitement}/100
          - Happiness level: ${moodContext.happiness}/100
          - Hunger level: ${moodContext.hunger}/100 (lower means hungrier)
          - Energy level: ${moodContext.energy}/100
          - Boredom level: ${moodContext.boredom}/100 (higher means more bored)
          - Affection level: ${moodContext.affection}/100
          
          The message should feel personal and specifically tied to these exact stats.
          
          Here is some content for general context of tone of voice:
          
          // Hunger messages
          ${mammothName} is eagerly awaiting her tasty treats
          ${mammothName} is sad that you've forgotten to feed her lunch
          ${mammothName} is ready to eat! She wants her food NOW!
        
          // Playful messages
          ${mammothName} is feeling excited and energetic! Time for a new game!
          ${mammothName} is brimming with confidence! She's ready to win!
          ${mammothName} misses you and wants you to hang out with her
        
          // Sad messages
          ${mammothName} is really sad that you've been gone so long
          ${mammothName} is down in the dumps. Where have you been?
          ${mammothName} is sad that she lost the game. Give her a treat?
        
          // Angry messages
          ${mammothName} can't contain herself, she's so mad!
          ${mammothName} wants a rematch! No fair!
          This food is not what she wanted! ${mammothName} demands more NOW!
        
          // Sleepy messages
          Hmmmmm maybe it's time for a nap…hmmmmm
          ${mammothName} is tired after all that winning, time for a victory nap
          ${mammothName} can barely keep her eyes open, time to tuck her in
        
          OH WOW OH WOW ${mammothName} IS SO EXCITED TO SEE YOU
          ${mammothName} can't stay still, she's so happy!
          All the glaciers in the world won't stop ${mammothName} from giving you a big hug!
          ${mammothName} is content with life right now
          ${mammothName} feels pretty good about things
          ${mammothName} is relaxing and enjoying the moment
          ${mammothName} is getting a bit bored. Play with her?
          ${mammothName} is tapping her foot, waiting for something exciting to happen
          ${mammothName} wonders what you're up to. She's looking for entertainment
          `
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('Error generating custom mood message:', error);
    return null;
  }
} 