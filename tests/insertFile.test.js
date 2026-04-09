import { editFile } from "../tools/functions.js";

export async function runInsertTest() {
  console.log("Running: insert test");

  const result = await editFile({
    path: "src/auth.js",
    workspace: "/Users/davidnakeeran/test-project",
    operation: "insert",
    target: "return true;",
    content: `console.log("insert worked")`,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log("Insert test done");
}
