import { generateFile } from "./generateFile.js";
import { generateInputFile } from "./generateInputFile.js";
import { executeCpp } from "./executeCpp.js";
import { executePython } from "./executePython.js";
import { executeJava } from "./executeJave.js";
import { executeJs } from "./executeJS.js";

export const submitCompiler = async (req, res, next) => {
  console.log("--- COMPILER SERVICE /compiler/run HIT ---");
  const { language ="cpp", code, input, testcases } = req.body;

  if (code === undefined) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const filePath = generateFile(language, code);
    let customOutput = null;

    if (input !== undefined && input !== null && input.trim() !== "") {
      console.log("Compiler Service: Processing custom input run...");
      const inputfilePath = generateInputFile(input);
      customOutput = await executeCpp(filePath, inputfilePath);
      console.log("Compiler Service: Custom input run output:", customOutput);
    } else {
      console.log("Compiler Service: No custom input provided or it's empty. Skipping custom input run.");
    }

    const testResults = [];
    for (const tc of testcases) {
      try {
        const tcInputPath = generateInputFile(tc.input);
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
      output: customOutput,
      testResults,
      verdict: testResults.every((t) => t.passed) ? "Accepted" : "Wrong Answer",
    });
  } catch (error) {
    console.error("Error in submitCompiler:", error);
    res.status(500).json({ error: "Internal server error during code submission." });
  }
};

export const runCompiler = async (req, res, next) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    console.error("Compiler Service (run-custom): Code is missing.");
    return res.status(400).json({ error: "Code is required" });
  }

  console.log(`Compiler Service (run-custom): Lang: ${language}, Code: ${code.substring(0, 50)}..., Input: ${input}`);

  try {
    const filePath = generateFile(language, code);
    console.log(`Compiler Service (run-custom): File generated: ${filePath}`);
    const inputFilePath = generateInputFile(input);
    console.log(`Compiler Service (run-custom): Input file generated: ${inputFilePath}`);
    console.log("Compiler Service (run-custom): Executing code...");
    const executionOutput = await executeCpp(filePath, inputFilePath);
    console.log("Compiler Service (run-custom): Execution finished. Output:", executionOutput);

    res.json({
      output: executionOutput.trim(),
      error: null,
    });
  } catch (error) {
    console.error("--- ERROR IN COMPILER SERVICE run-custom ---");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    const outputFromError = error.stdout || error.stderr || "";
    res.status(500).json({
      output: outputFromError.trim(),
      error: error.message || "An internal error occurred in the compiler service during custom run.",
    });
  }
};
