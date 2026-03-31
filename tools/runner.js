import { toolRegistry } from "./registry.js";

export function runTool(name, args) {
  const tool = toolRegistry[name];

  if (!tool) {
    throw new Error("Tool not found");
  }

  return tool.run(args);
}
