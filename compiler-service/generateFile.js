import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {v4 as uuid} from "uuid";
//We have define __filename and __dirname 
const __filename = fileURLToPath(import.meta.url);//gives the absolute path to scheduler.js.
const __dirname = path.dirname(__filename);//gives the absolute path to the directory containing scheduler.js, 
// which is your compiler-service/ root directory.
//in ES Modules __filename and __dirname  are not available by default.
//If you try to use __dirname in a file with import/export, you'll get a ReferenceError.

const dirCodes = path.join(__dirname,"codes");
//D:\GITDEMO\OJ\OJ-Projext\backend\utils\generateFile.js\codes = codes joined with dirname
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
}
export const generateFile =  (lang,code) => {
   const jobId = uuid();
   const filename = `${jobId}.${lang}`;
   const filePath = path.join(dirCodes,filename);
   fs.writeFileSync(filePath,code);//writeFileSync is synchronous, these functions don't actually need to be async and 
   // they don't return a Promise that resolves later with the path.
   //They return the path string immediately.
   "D:\\GITDEMO\\OJ\\OJ-Projext\\backend\\utils\\codes\\5aa60838-278c-4d4f-a790-f177ba94a923.cpp"
   return filePath;
}

