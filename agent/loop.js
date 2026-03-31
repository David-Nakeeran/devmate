import "dotenv/config";
import { getUserInput } from "../cli/input.js";
import { generateAIResponse } from "../ai/gemini.js";
import { runTool } from "../tools/runner.js";

const functionDeclarations = [
  {
    name: "toUpperCase",
    description: "Converts text to uppercase",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
  {
    name: "readFile",
    description: "Reads a file and returns contents",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
      },
      required: ["path"],
    },
  },
  {
    name: "reverseText",
    description: "Reverses a string",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
  },
];

let history = [];

export async function runAgent() {
  let shouldStop = false;
  const MAX_ITERATIONS = 10;

  while (true) {
    const input = await getUserInput();

    let iterations = 0;
    shouldStop = false;

    history.push({
      role: "user",
      parts: [{ text: input }],
    });

    // AI Loop
    while (true) {
      if (iterations > MAX_ITERATIONS) {
        console.log(`System: Too many tool steps, stopping.`);
        shouldStop = true;
        break;
      }
      try {
        const response = await generateAIResponse(
          history,
          functionDeclarations,
        );

        if (response.functionCalls && response.functionCalls.length > 0) {
          iterations++;
          const functionCall = response.functionCalls[0];

          console.log(`AI wants to use tool: ${functionCall.name}`);

          const result = runTool(functionCall.name, functionCall.args);

          const functionResponsePart = {
            name: functionCall.name,
            response: {
              result: result,
            },
            id: functionCall.id,
          };

          history.push(response.candidates[0].content);

          history.push({
            role: "user",
            parts: [
              {
                functionResponse: functionResponsePart,
              },
            ],
          });
          continue;
        }
        console.log(`AI: ${response.text}`);
        break;
      } catch (error) {
        console.error("Error:", error.message);
        break;
      }
    }
    if (shouldStop) {
      continue;
    }
  }
}
