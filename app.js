"use strict";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readLine from "node:readline";

const ai = new GoogleGenAI({});
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const toolRegistry = {
  readFile: {
    run: async ({ path }) => {},
  },
  toUpperCase: {
    run: ({ text }) => {
      return text.toUpperCase();
    },
  },
  reverseText: {
    run: ({ text }) => {
      return text.split("").reverse().join("");
    },
  },
};

async function getUserInput() {
  return new Promise((resolve, reject) => {
    rl.question(`You: `, (answer) => {
      resolve(answer.trim());
    });
  });
}

function runTool(name, args) {
  const tool = toolRegistry[name];

  if (!tool) {
    throw new Error("Tool not found");
  }

  return tool.run(args);
}
let history = [];
async function runAgent() {
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

        // Did Gemini call a tool?
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

runAgent();
