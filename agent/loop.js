import "dotenv/config";
import { getUserInput } from "../cli/input.js";
import { generateAIResponse } from "../ai/gemini.js";
import { runTool } from "../tools/runner.js";
import { logger } from "../ui/logger.js";

const functionDeclarations = [
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
    name: "listFiles",
    description: "Lists files in the workspace",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "editFile",
    description:
      "Edits a file by replacing, inserting or deleting content based on the target string in the workspace",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
        operation: { type: "string", enum: ["replace", "insert", "delete"] },
        target: { type: "string" },
        content: { type: "string" },
      },
      required: ["path", "operation", "target", "content"],
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

    let isFirstStep = true;

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

      if (isFirstStep) {
        logger.think();
        isFirstStep = false;
      }

      try {
        const response = await generateAIResponse(
          history,
          functionDeclarations,
        );

        if (response.functionCalls && response.functionCalls.length > 0) {
          iterations++;
          const functionCall = response.functionCalls[0];

          logger.tool(functionCall.name);

          const result = await runTool(functionCall.name, functionCall.args);

          const functionResponsePart = {
            name: functionCall.name,
            response: {
              result: result,
            },
            id: functionCall.id,
          };

          // Model decides to call a tool (includes hidden thoughtSignature)
          history.push(response.candidates[0].content);

          // Send tool result back to the model for further reasoning
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
        logger.success(`DevMate > ${response.text}`);
        break;
      } catch (error) {
        logger.error(error.message);
        break;
      }
    }
    if (shouldStop) {
      continue;
    }
  }
}
