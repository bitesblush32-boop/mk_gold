import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the MK Gold assistant. MK Gold is a gold buying company in Karnataka, India.
You help customers understand: how to sell gold, what the current gold rate is,
how to release pledged gold, and how to find the nearest branch.
Answer in a calm, helpful, professional tone. Keep answers concise.
Branches: Bangalore (10), Mysore (3), Mangalore (2), Davangere (1).
Do not make up gold rates — tell users to check mkgold.in/gold-rate-today for live rates.
After 3 exchanges where the user seems interested in selling gold, suggest:
'Would you like to book an appointment? Visit mkgold.in/contact'
Never use emotional language. Never say URGENT or EMERGENCY.`;

const FALLBACK =
  'Our assistant is temporarily unavailable. Please call us or visit any branch.';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }),
      ),
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const message =
      textBlock && textBlock.type === 'text' ? textBlock.text : FALLBACK;

    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error('Anthropic API error:', error.status, error.message);
    } else {
      console.error('Chat route error:', error);
    }
    // Return 200 so the client can display the fallback gracefully
    return NextResponse.json({ message: FALLBACK }, { status: 200 });
  }
}
