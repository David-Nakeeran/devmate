import { editFile } from "../tools/functions.js";

export async function runReplaceTest() {
  console.log("Running: replaceFile test");
  await editFile({
    path: "auth.js",
    workspace: "/Users/davidnakeeran/test-project",
    operation: "replace",
    target: "",
    content: "",
  });
  console.log("Replace test done");
}
