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

export const executeJava = async (filePath, inputFilePath) => {
  const jobId = path.basename(filePath).split(".")[0]; // e.g., MyClass
  const dirPath = path.dirname(filePath);

  return new Promise((resolve) => {
    const command = `javac "${filePath}" && java -cp "${dirPath}" ${jobId} < "${inputFilePath}"`;

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
