import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const aiCodeReview = async (code) => {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Analyze the following code and provide a short and concise review of the code. Also, provide a list of potential improvements and suggestions for the code. " + code,
    });
    console.log(response.text);
    return response.text;
  
};

// CommonJS (the older Node.js style), which uses module.exports
//But here im using the ES Module
export { aiCodeReview };
