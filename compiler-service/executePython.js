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

export const executePython = async (filePath, inputfilePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  // Optional : storing output logs here
  //No output file (interpreted)

  return new Promise((resolve, reject) => {
    // - `python` runs the Python script
    // - `< inputFilePath` pipes input into the script

    const command = `python3 "${filePath}" < "${inputfilePath}"`;

    exec(command,{ timeout: 3000},(error, stdout, stderr) => {
      if (error) {
        // Compilation/runtime error (e.g., syntax error)
        reject({ error });
        return;
      }
      if (stderr) {
        // Python's runtime error (e.g., IndexError, ValueError, etc.)
        reject({ stderr });
        return;
      }
      resolve(stdout);
    });
  });
};
