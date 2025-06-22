import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export const executePython = async (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = `python3 "${filePath}" < "${inputFilePath}"`;

    exec(command, { timeout: 7000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed || error.signal === "SIGTERM") {
          return reject({
            message: "Time Limit Exceeded",
            stdout: stdout || "",
            stderr: stderr || "",
            exitCode: error.code || 1,
            timedOut: true,
            verdictHint: "Time Limit Exceeded",
          });
        }
        return reject({
          message: "Runtime Error",
          stdout: stdout || "",
          stderr: stderr || error.message,
          exitCode: error.code || 1,
          timedOut: false,
          verdictHint: "Runtime Error",
        });
      }

      return resolve({
        stdout: stdout.trim(),
        stderr: stderr?.trim() || "",
        exitCode: 0,
        timedOut: false,
        verdictHint: "Executed Successfully",
      });
    });
  });
};
