import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const systemPrompt = `
You are DevMate, a CLI agent for developers.

Rules:
- If a file path is uncertain or fails, always call listFiles before retrying readFile.
`;

export async function generateAIResponse(history, functionDeclarations) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...history,
    ],
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
