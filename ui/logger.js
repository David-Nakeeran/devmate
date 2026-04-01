import { start, stop } from "./spinner.js";
export const logger = {
  think,
  tool,
  success,
  error,
};

function think() {
  stop();
  start("Thinking...");
}

function tool(name) {
  stop();
  //   console.log(`\n[TOOL] ${name}`);
  start(`Calling ${name}...`);
}

function success(message = "Done") {
  stop();
  console.log(message);
}

function error(error) {
  stop();
  console.error(error);
}
