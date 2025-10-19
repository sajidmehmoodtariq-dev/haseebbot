import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, model, history } = await request.json();

    // Handle different AI models
    switch (model) {
      case 'gemini':
        return await handleGeminiRequest(message, history);
      case 'gpt':
        return await handleOpenAIRequest(message, history);
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
      console.log('No Google AI API key found');
      return getDummyResponse('gemini', message);
    }

    console.log('Attempting to use Gemini API with new SDK...');
    
    // Use the new API syntax from documentation
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: message,
    });

    const text = response.text;
    console.log('Gemini API success, response length:', text.length);

    return NextResponse.json({
      content: text,
      model: 'gemini',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error details:', {
      message: error.message,
      status: error.status,
      cause: error.cause
    });
    
    return getDummyResponse('gemini', message);
  }
}

async function handleOpenAIRequest(message, history) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return getDummyResponse('gpt', message);
    }

    // Convert history to OpenAI format
    const messages = [
      ...(history?.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || []),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    return NextResponse.json({
      content: text,
      model: 'gpt',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return getDummyResponse('gpt', message);
  }
}

async function handleGrokRequest(message, history) {
  try {
    if (!process.env.GROK_API_KEY) {
      return getDummyResponse('grok', message);
    }

    console.log('Attempting Groq API call...');
    
    // Convert history to Groq format
    const messages = [
      ...(history?.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    console.log('Groq API success, response length:', text.length);

    return NextResponse.json({
      content: text,
      model: 'grok',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Grok API Error:', error.message);
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

    gpt: `**GPT-4o Mini Response:**

Hello! I'm GPT-4o Mini from OpenAI. You asked: "${message}"

*Note: To get real responses, add your OPENAI_API_KEY to .env.local*

This is a demo response. In a real implementation, I would:
- Process your query using OpenAI's GPT API
- Provide comprehensive, well-structured responses
- Excel at creative writing and problem-solving
- Offer accurate and helpful information

⚡ *OpenAI's efficient model at your service!*`,

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