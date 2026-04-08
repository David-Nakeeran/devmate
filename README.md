# DevMate

DevMate is a CLI based developer assistant built as a tool using AI agent. It can read, understand and modify files within a workspace by chaining structured tool calls.

## Overview

DevMate is designed to explore how AI agents can go beyond simple chat and take meaningful actions in a real development environment.

Instead of returning text responses, DevMate:

- Inspects project files.
- Reasons about tasks.
- Applies changes directly to code.

## Features

- Agent loop with iterative reasoning.
- Tool system (readFile, listFiles, editFile).
- Workspace aware file operations.
- Code editing (replace, delete, insert in progress).
- Structured logging of agent decisions and tool usage.

## How It Works

DevMate runs an agent loop that:

1. Receives a user request.
2. Decides whether to call a tool or respond.
3. Executes tool calls (e.g. reading or editing files).
4. Feeds results back into the loop.
5. Repeats until the task is complete.

The system separates:

- **AI decision making** (what to do).
- **Tool execution** (how it’s done safely).

## Tools

- `listFiles` – returns a structured view of the workspace.
- `readFile` – reads file contents.
- `editFile` – modifies files using replace/delete operations (insert in progress).

## Tech Stack

- Node.js
- JavaScript (ES modules)
- File system API (`fs/promises`)
- Gemini API (tool calling)

## Getting Started

```bash
git clone <your-repo>
cd devmate
npm install
npm start
```

## Development

Testing is currently done through manual function calls and CLI interaction.
Planned improvements include structured test cases for tool reliability.

## Future Improvements

- Smarter code edits (scoped / context-aware).
- Insert operation support.
- Improved error handling and recovery.
- More advanced tools (search, refactor, etc.).

## Why This Project

This project explores building AI systems that can safely interact with real codebases, focusing on:

- Reliability over novelty.
- Clear separation of concerns.
- Incremental improvement of agent capabilities.
