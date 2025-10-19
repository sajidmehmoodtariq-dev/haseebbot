// Test Gemini API with new SDK
import { GoogleGenAI } from '@google/genai';

const API_KEY = 'AIzaSyBkJ31CKDDiRVvKby0gbuan0JGdfV3SZFk';

const ai = new GoogleGenAI({
  apiKey: API_KEY
});

async function testGemini() {
  try {
    console.log('Testing gemini-2.0-flash-exp...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: "Hello, how are you?",
    });
    console.log('Success:', response.text);
  } catch (error) {
    console.log('gemini-2.0-flash-exp failed:', error.message);
  }

  try {
    console.log('Testing gemini-1.5-flash...');
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello, how are you?",
    });
    console.log('Success:', response.text);
  } catch (error) {
    console.log('gemini-1.5-flash failed:', error.message);
  }
}

testGemini();