// Test Gemini API separately
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBkJ31CKDDiRVvKby0gbuan0JGdfV3SZFk';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
  try {
    // Try basic model
    console.log('Testing gemini-pro...');
    const model1 = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result1 = await model1.generateContent('Hello, how are you?');
    console.log('gemini-pro works:', result1.response.text());
  } catch (error) {
    console.log('gemini-pro failed:', error.message);
  }

  try {
    // Try 1.5 model
    console.log('Testing gemini-1.5-flash...');
    const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result2 = await model2.generateContent('Hello, how are you?');
    console.log('gemini-1.5-flash works:', result2.response.text());
  } catch (error) {
    console.log('gemini-1.5-flash failed:', error.message);
  }

  try {
    // List available models
    console.log('Listing available models...');
    const models = await genAI.listModels();
    console.log('Available models:', models.map(m => m.name));
  } catch (error) {
    console.log('Could not list models:', error.message);
  }
}

testGemini();