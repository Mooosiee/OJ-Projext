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

export const executeCpp = async (filePath, inputfilePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const execPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve) => {
    const command = `g++ "${filePath}" -o "${execPath}" && "${execPath}" < "${inputfilePath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          // Time Limit Exceeded
          return resolve({
            stdout: "",
            stderr: "Time Limit Exceeded",
            exitCode: error.code || 1,
            timedOut: true,
          });
        }
        // Runtime error or compilation failure
        return resolve({
          stdout: "",
          stderr: stderr || error.message,
          exitCode: error.code || 1,
          timedOut: false,
        });
      }

      // Successful execution
      return resolve({
        stdout: stdout.trim(),
        stderr: stderr?.trim() || "",
        exitCode: 0,
        timedOut: false,
      });
    });
  });
};
