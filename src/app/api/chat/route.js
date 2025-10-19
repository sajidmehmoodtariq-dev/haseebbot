import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    const { message, model, history } = await request.json();

    // Handle different AI models
    switch (model) {
      case 'gemini':
        return await handleGeminiRequest(message, history);
      case 'grok':
        return await handleGrokRequest(message, history);
      case 'claude':
        return await handleClaudeRequest(message, history);
      default:
        return await handleGeminiRequest(message, history);
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function handleGeminiRequest(message, history) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return getDummyResponse('gemini', message);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Convert history to Gemini format
    const chat = model.startChat({
      history: history?.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })) || []
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      content: text,
      model: 'gemini',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return getDummyResponse('gemini', message);
  }
}

async function handleGrokRequest(message, history) {
  try {
    if (!process.env.GROK_API_KEY) {
      return getDummyResponse('grok', message);
    }

    // Grok API implementation would go here
    // For now, return dummy response
    return getDummyResponse('grok', message);

  } catch (error) {
    console.error('Grok API Error:', error);
    return getDummyResponse('grok', message);
  }
}

async function handleClaudeRequest(message, history) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return getDummyResponse('claude', message);
    }

    // Claude API implementation would go here
    // For now, return dummy response
    return getDummyResponse('claude', message);

  } catch (error) {
    console.error('Claude API Error:', error);
    return getDummyResponse('claude', message);
  }
}

function getDummyResponse(model, message) {
  const responses = {
    gemini: `**Gemini Pro Response:**

Hello! I'm Gemini Pro, Google's advanced AI model. You asked: "${message}"

*Note: To get real responses, add your GOOGLE_AI_API_KEY to .env.local*

This is a demo response. In a real implementation, I would:
- Process your query using Google's Gemini API
- Provide intelligent, contextual responses
- Leverage my training on diverse datasets
- Offer helpful, accurate information

🌟 *Ready to help with coding, analysis, creative tasks, and more!*`,

    grok: `**Grok Response:**

Hey there! Grok here, with a bit of wit and wisdom. Your query: "${message}"

*Note: To get real responses, add your GROK_API_KEY to .env.local*

This is a placeholder response. In the actual setup, I'd:
- Connect to X's Grok API
- Give you responses with personality
- Mix humor with helpfulness
- Challenge conventional thinking

🚀 *Let's explore ideas together with some attitude!*`,

    claude: `**Claude Response:**

Greetings! Claude (Anthropic) here, responding to: "${message}"

*Note: To get real responses, add your ANTHROPIC_API_KEY to .env.local*

This demonstrates the extensible architecture. I would:
- Provide thoughtful, nuanced responses
- Excel at analysis and reasoning tasks
- Maintain helpful, harmless principles
- Offer detailed explanations

🎯 *Anthropic's assistant at your service!*`
  };

  return NextResponse.json({
    content: responses[model] || responses.gemini,
    model: model,
    timestamp: new Date().toISOString()
  });
}