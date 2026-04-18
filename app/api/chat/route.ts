import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, isRateLimitError, CHAT_SYSTEM_PROMPT } from '@/lib/gemini';
import { getMockChatResponse } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const userApiKey = req.headers.get('x-user-api-key');
    const client = getGeminiClient(userApiKey);

    if (!client) {
      return NextResponse.json({
        response: getMockChatResponse(message),
        isMock: true,
      });
    }

    try {
      // Build conversation contents
      const contents = [
        { role: 'user' as const, parts: [{ text: CHAT_SYSTEM_PROMPT }] },
        { role: 'model' as const, parts: [{ text: 'Understood. I am Syntra AI, your productivity assistant. How can I help you today?' }] },
      ];

      // Add history
      if (history && Array.isArray(history)) {
        for (const msg of history.slice(-10)) { // Last 10 messages for context
          contents.push({
            role: msg.role === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: msg.content }],
          });
        }
      }

      // Add current message
      contents.push({ role: 'user' as const, parts: [{ text: message }] });

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });

      return NextResponse.json({
        response: response.text || 'I apologize, I could not generate a response. Please try again.',
        isMock: false,
      });
    } catch (apiError) {
      if (isRateLimitError(apiError)) {
        return NextResponse.json(
          { error: 'rate_limit', message: 'API rate limit reached.' },
          { status: 429 }
        );
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: getMockChatResponse('fallback'),
      isMock: true,
    });
  }
}
