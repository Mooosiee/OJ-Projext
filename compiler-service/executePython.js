import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "outputs");

// Create outputs directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export const executePython = async (filePath, inputfilePath) => {

  console.log("[executePython] : Entered");
  return new Promise((resolve) => {
    const command = `python3 "${filePath}" < "${inputfilePath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          return resolve({
            stdout: "",
            stderr: "Time Limit Exceeded",
            exitCode: error.code || 1,
            timedOut: true,
          });
        }
        return resolve({
          stdout: "",
          stderr: stderr || error.message,
          exitCode: error.code || 1,
          timedOut: false,
        });
      }

      return resolve({
        stdout: stdout.trim(),
        stderr: stderr?.trim() || "",
        exitCode: 0,
        timedOut: false,
      });
    });
  });
};
