import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, isRateLimitError } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const userApiKey = req.headers.get('x-user-api-key');
    const client = getGeminiClient(userApiKey);

    if (!client) {
      return NextResponse.json({
        response: 'Voice AI requires a Gemini API key. Please add your key in settings.',
        audioData: null,
        isMock: true,
      });
    }

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{
              text: `You are Syntra Voice AI, a calm and supportive productivity assistant. 
The user is speaking to you via voice. Keep your responses concise, warm, and actionable. 
Respond to: ${message}`
            }],
          },
        ],
        config: {
          responseModalities: ['TEXT'],
        },
      });

      return NextResponse.json({
        response: response.text || 'I could not process that. Please try again.',
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
    console.error('Voice API error:', error);
    return NextResponse.json({
      response: 'An error occurred with voice processing. Please try typing your message instead.',
      audioData: null,
      isMock: true,
    });
  }
}
