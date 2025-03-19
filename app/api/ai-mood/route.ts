import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with API key from server environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mammothName, moodContext } = body;
    
    if (!openai.apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
          - This is action #${moodContext.actionCount} the user has taken
          
          The message should feel personal and specifically tied to these exact stats.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });
    
    const generatedText = response.choices[0]?.message?.content?.trim() || null;
    
    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('Error generating custom mood message:', error);
    return NextResponse.json(
      { error: 'Failed to generate mood text' },
      { status: 500 }
    );
  }
} 