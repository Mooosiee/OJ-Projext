import { aiCodeReview } from "../services/AICodeReveiw.js";

export const aiReview = async (req, res) => {
  const { code } = req.body;
  if (code === undefined) {
    return res.status(400).json({ error: "Code is required" });
  }
  try {
    const review = await aiCodeReview(code);
    res.status(200).json({ "review": review });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: "Unable to Review Code"
    });
  }
};