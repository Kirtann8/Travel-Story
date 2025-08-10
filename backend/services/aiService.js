const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const enhanceStory = async (story) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Enhance this travel story by improving the writing style, adding vivid descriptions, and making it more engaging while keeping the original meaning and facts. Keep it concise and travel-focused:

"${story}"

Enhanced version:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error('Failed to enhance story: ' + error.message);
  }
};

const generateTitle = async (story, locations) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const locationText = locations && locations.length > 0 ? locations.join(', ') : '';
    
    const prompt = `Generate 3 catchy, creative titles for this travel story. Consider the locations: ${locationText}

Story: "${story}"

Provide exactly 3 titles, one per line, without numbering or bullets:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const titles = response.text().split('\n').filter(title => title.trim()).slice(0, 3);
    return titles;
  } catch (error) {
    throw new Error('Failed to generate titles: ' + error.message);
  }
};

const travelAssistant = async (question, userStories = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let context = "You are a helpful travel assistant. ";
    if (userStories.length > 0) {
      const locations = userStories.map(s => s.visitedLocation).join(", ");
      context += `The user has visited: ${locations}. `;
    }
    
    const prompt = `${context}Answer naturally and conversationally: ${question}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "I'd love to help you plan your next adventure! What destination interests you?";
  }
};

module.exports = { enhanceStory, generateTitle, travelAssistant };