import { errorHandler } from "../backend/utils/error.js";
import { generateFile } from "./generateFile.js";
import { executeCpp } from "./executeCpp.js";
import { generateInputFile } from "./generateInputFile.js";
export const runCompiler = async (req, res, next) => {
  console.log("--- COMPILER SERVICE /compiler/run HIT ---");
  const { language = "cpp",code, input, testcases } = req.body;
  if (code === undefined) {
    return next(errorHandler(400, "Code is required"));
  }
  try {
    const filePath = generateFile(language, code);
    //for now , only submitting code so custom output is null;
    const customOutput = null; //await executeCpp(filePath, inputfilePath);
    // Only run custom input if 'input' is provided AND not empty
    if (input !== undefined && input !== null && input.trim() !== "") {
      console.log("Compiler Service: Processing custom input run...");
      const inputfilePath = await generateInputFile(input);
      customOutput = await executeCpp(filePath, inputfilePath); // This is output of custom input
      console.log("Compiler Service: Custom input run output:", customOutput);
    } else {
      console.log(
        "Compiler Service: No custom input provided or it's empty. Skipping custom input run."
      );
    }
    // You might still want to compile the code here to catch compilation errors early
    // and set 'overallMessageForClient'.
    // For simplicity, we'll assume executeCpp handles compilation checks.
    //Run testcases
    const testResults = [];
    for (const tc of testcases) {
      try {
        const tcInputPath = await generateInputFile(tc.input);
        const output = await executeCpp(filePath, tcInputPath);
        testResults.push({
          input: tc.input,
          expected: tc.output,
          actual: output,
          passed: output.trim() === tc.output.trim(),
        });
      } catch (error) {
        testResults.push({
          input: tc.input,
          error: error.message,
        });
      }
    }

    res.json({
      output: customOutput, // This will be null if no custom input was run
      testResults,
      verdict: testResults.every((t) => t.passed) ? "Accepted" : "Wrong Answer",
    });
  } catch (error) {
    next(error);
  }
};
