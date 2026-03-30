"use strict";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readLine from "node:readline";

const ai = new GoogleGenAI({});
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chat = await ai.chats.create({
  model: "gemini-2.5-flash-lite",
});

async function getUserInput() {
  return new Promise((resolve, reject) => {
    rl.question(`You: `, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function aiCall(input) {
  if (!input) {
    return "Please enter something.";
  }

  const response = await chat.sendMessage({
    message: `${input}`,
  });
  return response.text;
}

async function main() {
  while (true) {
    try {
      const userInput = await getUserInput();
      const response = await aiCall(userInput);
      console.log(`AI: ${response.trim()}`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

main();
