import { errorHandler } from "../utils/error.js";
import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/executeCpp.js";
import { generateInputFile } from "../utils/generateInputFile.js";
export const runCompiler = async (req, res, next) => {
  const { lang = "cpp", code , input } = req.body;
  if (code === undefined) {
    return next(errorHandler(400, "Code is required"));
  }
  try {
    const filePath = generateFile(lang, code);
    const inputfilePath = generateInputFile(input);
    const outPath = await executeCpp(filePath,inputfilePath);
    res.json({filePath,outPath});
  } catch (error) {
    next(error);
  }
};
