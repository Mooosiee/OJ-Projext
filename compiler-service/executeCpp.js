// Imports Node's fs (File System) module to work with files and directories.
import fs from "fs"
// Imports Node’s path module to handle and manipulate file paths.
import path from "path"
//In Node.js, the child_process module is used to create and manage 
// subprocesses — other programs or scripts that run separately from your main Node.js process.
import { exec } from "child_process";
// Needed when using ES modules (import) to get the current file path.
import { fileURLToPath } from "url";
//Converts the ES module URL to a path and then extracts the directory name.
const __filename = fileURLToPath(import.meta.url);
// Equivalent to __dirname in CommonJS.
const __dirname = path.dirname(__filename);
// Creates a full path to the outputs directory inside the current directory.
const outputPath = path.join(__dirname, "outputs");

// Checks if the outputs directory exists; if not, it creates it.
//recursive: true ensures all parent directories are created if needed.
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
//filePath = "D:\\GITDEMO\\OJ\\OJ-Projext\\backend\\utils\\codes\\5aa60838-278c-4d4f-a790-f177ba94a923.cpp"
export const executeCpp = async (filePath,inputfilePath) => {
  //path.basename = 5aa60838-278c-4d4f-a790-f177ba94a923.cpp
  const jobId = path.basename(filePath).split(".")[0]; // = ["5aa60838-278c-4d4f-a790-f177ba94a923" ,"cpp"]
  const dirPath = path.join(outputPath, `${jobId}.exe`);
  return new Promise((resolve, reject) => {
    const command = `g++ "${filePath}" -o "${dirPath}" && "${dirPath}" < "${inputfilePath}"`;
      // Run the command using child_process.exec
      //exec(command,callback)
     //Add timeout to exec options in executeCpp.js as well :3 secs
     // To prevent infinite loops
    exec(command,{ timeout: 3000},(error, stdout, stderr) => {
        //error : points out any development error we have
        if(error){
            reject({stderr});
            return;
        }
        //stderr : points out error that comes with 'cmd'
        if(stderr){
            reject({stderr});
            return;
        }
        //stdout : gives the output  
        if(stdout){
            resolve(stdout);
        }
    });
  });
};
