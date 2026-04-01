const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

let i = 0;
let intervalId;

export function start(status) {
  if (intervalId) {
    i = 0;
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    process.stdout.write("\r" + frames[i] + ` ${status}`);
    i++;

    if (i === frames.length) {
      i = 0;
    }
  }, 100);
}

export function stop() {
  process.stdout.write("\r\x1b[K");
  clearInterval(intervalId);
  intervalId = null;
}
