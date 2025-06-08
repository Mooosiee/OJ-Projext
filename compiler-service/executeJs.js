import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input/output folder
const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// filePath = JavaScript file (e.g., hello.js)
// inputFilePath = path to input.txt
export const executeJs = async (filePath, inputFilePath) => {
  //No compilation needed in js
  //No output file (interpreted)
  return new Promise((resolve, reject) => {
    // Use Node.js to run the file, and redirect input
    const command = `node "${filePath}" < "${inputFilePath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) return reject({ error });
      if (stderr) return reject({ error });
      resolve(stdout);
    });
  });
};
