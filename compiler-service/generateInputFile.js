import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {v4 as uuid} from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname,"inputs");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
}
export const generateInputFile =  (input) => {
   const jobId = uuid();
   const input_filename = `${jobId}.txt`;
   const input_filePath = path.join(dirCodes,input_filename);
   fs.writeFileSync(input_filePath,input);
   return input_filePath;
}

