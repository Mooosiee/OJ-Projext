import { errorHandler } from "../utils/error.js";


export const executeCustomCode = async (req, res, next) => {
  console.log("--------------------------------------------------");
  console.log("[Controller] executeCustomCode: Entered");
  try {
    const { language = "cpp", code, input } = req.body;

    if (!code) {
      // Using next(errorHandler(...)) assumes errorHandler is available/imported
      // and you have a global error handler to send the JSON response.
      // For simplicity here, sending direct response:
      return next(errorHandler(400,"Code is required for custom execution."));
    }
    console.log(`[Controller] executeCustomCode: Language: ${language}, Code snippet: ${code.substring(0,50)}..., Input: ${input}`);

    console.log("[Controller] executeCustomCode: Forwarding to compiler service for custom run...");
    const compilerServicePayload = { language, code, input };
    const compilerRes = await fetch("https://og-oj-compiler.onrender.com/compiler/custom-in-run", { // NEW COMPILER SERVICE ENDPOINT
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(compilerServicePayload),
    });

    console.log("[Controller] executeCustomCode: Compiler service responded with status:", compilerRes.status);

    if (!compilerRes.ok) {
      let errorMsg = `Compiler service (custom run) failed with status: ${compilerRes.status}`;
      try {
        const errorData = await compilerRes.json();
        errorMsg = errorData.message || JSON.stringify(errorData);
      } catch (e) { /* ignore */ }
        next(errorMsg); // This will be caught by the outer catch and passed to next()
    }

    const data = await compilerRes.json(); // Expected {output,error}
    console.log("[Controller] executeCustomCode: Received from compiler:", data);

    res.status(200).json(data); // Forward compiler's response to frontend

  } catch (error) {
    console.error("[Controller] executeCustomCode: ERROR CAUGHT:", error.message);
    console.error("[Controller] executeCustomCode: ERROR STACK:", error.stack);
    // Pass to global error handler (if 'next' is defined and used)
    // next(error);
    // Or send direct error if this controller is simple and doesn't use Express's next()
    next(error);
  }
};
