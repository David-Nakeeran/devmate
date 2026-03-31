import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function generateAIResponse(history, functionDeclarations) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history,
    config: {
      tools: [
        {
          functionDeclarations: functionDeclarations,
        },
      ],
    },
  });
  return response;
}
