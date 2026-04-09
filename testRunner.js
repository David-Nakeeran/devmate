import { runReplaceTest } from "./tests/replaceFile.test.js";
import { runDeleteTest } from "./tests/deleteFile.test.js";
import { runInsertTest } from "./tests/insertFile.test.js";

async function runTests() {
  console.log("\n=== DEV TEST RUNNER ===\n");

  try {
    // await runReplaceTest();
    // await runDeleteTest();
    await runInsertTest();

    console.log("\n ALL TESTS PASSED");
  } catch (err) {
    console.error("\n TEST FAILED:");
    console.error(err.message);
  }
}

runTests();
