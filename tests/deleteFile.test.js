import { editFile } from "../tools/functions.js";

export async function runDeleteTest() {
  console.log("Running: delete test");

  const result = await editFile({
    path: "src/auth.js",
    workspace: "/Users/davidnakeeran/test-project",
    operation: "delete",
    target: "return null;",
    content: "",
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  console.log("Delete test done");
}
