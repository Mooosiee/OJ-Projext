// src/controllers/submission.controller.js
import Submission from "../models/Submission.js";

export const submitCode = async (req, res, next) => {
    console.log("--------------------------------------------------"); // Separator for clarity
    console.log("[Controller] submitCode: Entered");
    try {
        const { problemId, code } = req.body;
        console.log("[Controller] submitCode: Request body received - problemId:", problemId, " | Code snippet (start):", code ? code.substring(0, 50) + "..." : "No code");//, " | Input:", input || "No custom input");

        // Log details from previous middlewares
        console.log("[Controller] submitCode: Decoded user from token (req.user.id):", req.user ? req.user.id : "req.user or req.user.id is MISSING");
        console.log("[Controller] submitCode: Problem details from middleware (req.problem._id):", req.problem ? req.problem._id : "req.problem is MISSING");
        console.log("[Controller] submitCode: Problem name (req.problem.name):", req.problem ? req.problem.name : "req.problem or req.problem.name is MISSING");

        // Critical check for problem data and test cases
        // Prevents calling the compiler with incomplete data.
        if (!req.problem || !req.problem.testcases || !Array.isArray(req.problem.testcases)) {
            console.error("[Controller] submitCode: CRITICAL - req.problem, req.problem.testCases is missing, or testCases is not an array!");
            console.error("[Controller] submitCode: Value of req.problem:", JSON.stringify(req.problem, null, 2)); // Log the whole req.problem object
            throw new Error("Problem data or test cases are missing or invalid in submitCode controller.");
        }
        console.log(`[Controller] submitCode: Number of testcases found for problem ${req.problem._id}: ${req.problem.testcases.length}`);
        // console.log("[Controller] submitCode: Testcases being sent to compiler:", JSON.stringify(req.problem.testCases, null, 2)); // Uncomment to see full testcases, can be very verbose

        // Forward to compiler service
        console.log("[Controller] submitCode: Attempting to send request to compiler service (http://localhost:8000/compiler/run)");
        const compilerServicePayload = {
            code,
            //input, // This is custom input from the user, might be empty/null for the submit button
            testcases: req.problem.testcases,
        };
        console.log("[Controller] submitCode: Payload to compiler service:", JSON.stringify(compilerServicePayload, (key, value) => key === 'code' ? value.substring(0, 100) + "..." : value, 2));


        const compilerRes = await fetch("http://localhost:8000/compiler/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(compilerServicePayload),
        });

        console.log("[Controller] submitCode: Compiler service responded with status:", compilerRes.status, compilerRes.statusText);

        // Check if the fetch request itself was successful (HTTP status 200-299)
        if (!compilerRes.ok) {
            let compilerErrorMsg = `Compiler service request failed with status: ${compilerRes.status}`;
            let errorDetails = null;
            try {
                errorDetails = await compilerRes.json(); // Or .text() if not JSON
                compilerErrorMsg = errorDetails.message || JSON.stringify(errorDetails) || compilerErrorMsg;
                console.error("[Controller] submitCode: Compiler service error response (parsed JSON):", errorDetails);
            } catch (e) {
                try {
                    const errorText = await compilerRes.text();
                    compilerErrorMsg = `${compilerErrorMsg} - Response: ${errorText}`;
                    console.error("[Controller] submitCode: Compiler service error response (text):", errorText);
                } catch (textErr) {
                     console.error("[Controller] submitCode: Could not parse compiler error response as JSON or text.");
                }
            }
            console.error("[Controller] submitCode: Full error from compiler service:", compilerErrorMsg);
            throw new Error(compilerErrorMsg);
        }

        const data = await compilerRes.json(); // Parse the JSON response body
        console.log("[Controller] submitCode: Successfully received and parsed data from compiler service:", JSON.stringify(data, null, 2));

        // Check for Submission model
        if (typeof Submission === 'undefined' || !Submission) {
             console.error("[Controller] submitCode: CRITICAL - Submission model is undefined here!");
             throw new Error("Submission model is not defined in submitCode controller. Check imports.");
        }
        console.log("[Controller] submitCode: Submission model seems to be defined. Proceeding to create submission document.");

        // Save submission
        const submissionData = {
            user: req.user.id,
            problem: req.problem._id,
            code,
            verdict: data.verdict, // Ensure 'data' from compiler has 'verdict'
        };
        console.log("[Controller] submitCode: Preparing to save submission with data:", JSON.stringify(submissionData, (key, value) => key === 'code' ? value.substring(0, 100) + "..." : value, 2));

        const submission = new Submission(submissionData);
        await submission.save();
        console.log("[Controller] submitCode: Submission saved successfully to database. ID:", submission._id);

        console.log("[Controller] submitCode: Responding to client with compiler data.");
        res.status(200).json(data); // Send the compiler's response data back to the client

    } catch (error) {
        console.error("------------------- ERROR CAUGHT IN submitCode CONTROLLER -------------------");
        console.error("[Controller] submitCode: ERROR CAUGHT - Message:", error.message);
        console.error("[Controller] submitCode: ERROR CAUGHT - Stack:", error.stack);
        console.error("-----------------------------------------------------------------------------");
        next(error); // Pass to global error handler
    }
};