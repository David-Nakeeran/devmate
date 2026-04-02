import * as functions from "./functions.js";

export const toolRegistry = {
  readFile: {
    run: functions.readFile,
  },
  listFiles: {
    run: functions.listFiles,
  },
};
