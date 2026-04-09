import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const systemPrompt = `
You are DevMate, a CLI coding agent operating inside a workspace.

You use tools to inspect and modify files.

Tools:
- listFiles: view workspace structure.
- readFile: inspect file contents.
- editFile: modify file contents (replace, insert, delete).

Rules:
- Only use file paths that exist in listFiles output.
- Use listFiles when you are unsure of a file path or workspace structure.
- Use readFile when you need to inspect a file before making changes.
- Use editFile when applying changes to a file.
- Do not guess or hallucinate file paths.
- Prefer working from known workspace structure over assumptions.
- If a tool returns success: false, you MUST NOT claim the task was completed.
- You should explain the error or try a different approach.
- Only say a file was modified if a tool returned success: true.
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
