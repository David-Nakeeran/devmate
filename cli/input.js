import readLine from "node:readline";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function getUserInput() {
  return new Promise((resolve, reject) => {
    rl.question(`DevMate > `, (answer) => {
      resolve(answer.trim());
    });
  });
}
