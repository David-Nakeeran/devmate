import * as functions from "./functions.js";

export const toolRegistry = {
  readFile: {
    run: functions.readFile,
  },
  toUpperCase: {
    run: functions.toUpperCase,
  },
  reverseText: {
    run: functions.reverseText,
  },
};
