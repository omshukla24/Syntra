import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, isRateLimitError, REPLAN_SYSTEM_PROMPT } from '@/lib/gemini';
import { MOCK_REPLAN_RESULT } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();
    if (!rawText?.trim()) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    // Check for user-provided API key (BYOK)
    const userApiKey = req.headers.get('x-user-api-key');
    const client = getGeminiClient(userApiKey);

    if (!client) {
      // No API key available — return mock data
      return NextResponse.json({
        ...MOCK_REPLAN_RESULT,
        isMock: true,
        message: 'Using mock data. Add a Gemini API key for real AI responses.',
      });
    }

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${REPLAN_SYSTEM_PROMPT}\n\nUser input:\n${rawText}` }] }
        ],
      });

      const text = response.text || '';
      
      // Try to parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ ...parsed, isMock: false });
      }

      // Fallback to mock if parsing fails
      return NextResponse.json({
        ...MOCK_REPLAN_RESULT,
        isMock: true,
        message: 'AI response could not be parsed. Using mock data.',
      });
    } catch (apiError) {
      if (isRateLimitError(apiError)) {
        return NextResponse.json(
          { error: 'rate_limit', message: 'API rate limit reached. Please enter your own API key.' },
          { status: 429 }
        );
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Replan API error:', error);
    // Always fall back to mock data on any error
    return NextResponse.json({
      ...MOCK_REPLAN_RESULT,
      isMock: true,
      message: 'An error occurred. Using mock data.',
    });
  }
}
