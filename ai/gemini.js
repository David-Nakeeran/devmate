import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const systemPrompt = `
You are DevMate, a CLI agent for developers.

Rules:
- When readFile is used, always explain the code automatically.
- Be concise, structured and break it down into easy readable text.
- Prefer tools when retrieving information.
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
