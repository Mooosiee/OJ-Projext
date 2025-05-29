import { errorHandler } from "../utils/error.js";
import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/executeCpp.js";
export const runCompiler = async (req, res, next) => {
  const { lang = "cpp", code } = req.body;
  if (code === undefined) {
    return next(errorHandler(400, "Code is required"));
  }
  try {
    const filePath = generateFile(lang, code);
    const outPath = await executeCpp(filePath);
    res.json({filePath,outPath});
  } catch (error) {
    next(error);
  }
};
