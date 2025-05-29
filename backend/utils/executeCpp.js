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
//filePath = "D:\\GITDEMO\\OJ\\OJ-Projext\\backend\\utils\\codes\\5aa60838-278c-4d4f-a790-f177ba94a923.cpp"
export const executeCpp = (filePath) => {
  //path.basename = 5aa60838-278c-4d4f-a790-f177ba94a923.cpp
  const jobId = path.basename(filePath).split(".")[0]; // = ["5aa60838-278c-4d4f-a790-f177ba94a923" ,"cpp"]
  const outPath = path.join(outputPath, `${jobId}.exe`);
  return new Promise((resolve, reject) => {
    const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}"`;
    exec(command, (error, stdout, stderr) => {
        //error : points out any development error we have
        if(error){
            reject({stderr});
        }
        //stderr : points out error that comes with 'cmd'
        if(stderr){
            reject({stderr});
        }
        //stdout : gives the output  
        if(stdout){
            resolve(stdout);
        }
    });
  });
};
