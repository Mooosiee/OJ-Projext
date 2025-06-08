import fs from "fs";
import path, { resolve } from "path";
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
  const dirPath = path.dirname(filePath); // directory containing the Java file
  return new Promise((resolve, reject) => {
    // 1. Compile the Java file
    // 2. If successful, run the class file

    const command = `javac "${filePath}" && java -cp "${dirPath}" ${jobId} < "${inputFilePath}"`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        reject({ error });
        return;
      }
      if (stderr) {
        reject({ stderr });
        return;
      }
      resolve(stdout);
    });
  });
};
