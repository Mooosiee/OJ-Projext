// src/utils/fetchProblem.js (or your correct path)
import Problem from "../models/Problem.js";
import { errorHandler } from "./error.js"; // Assuming error.js is in the same 'utils' directory
/**
 * Middleware to fetch a problem by its ID and attach it to the request object.
 * Assumes problemId is present in req.body.problemId.
 * Attaches the fetched problem to req.problem.
 */
export const fetchProblemById = async (req, res, next) => {
    console.log("--------------------------------------------------"); // Separator
    console.log("[Middleware] fetchProblemById: Entered");
    try {
        const { problemId } = req.body;
        console.log("[Middleware] fetchProblemById: Extracted problemId from req.body:", problemId);

        if (!problemId) {
            console.warn("[Middleware] fetchProblemById: Problem ID is missing from req.body.");
            // Create an error object and pass it to next()
            // Your errorHandler utility creates the error object correctly.
            return next(errorHandler(400, "Problem ID is required in the request body."));
        }

        // Check if Problem model is defined (crucial for debugging import issues)
        console.log("[Middleware] fetchProblemById: Checking if Problem model is defined.");
        if (typeof Problem === 'undefined' || !Problem) {
            console.error("[Middleware] fetchProblemById: CRITICAL - Problem model is undefined here! Check import path and export in Problem.js.");
            // Create and throw a new error that will be caught by the catch block
            throw new Error("Problem model is not defined in fetchProblemById middleware. Check server logs for import issues.");
        }
        console.log("[Middleware] fetchProblemById: Problem model appears to be defined. Attempting to find Problem with ID:", problemId);

        // Fetch the problem from the database
        const problem = await Problem.findById(problemId).select('testcases name _id'); // Ensure 'testcases' matches your schema if that's the field name

        if (!problem) {
            console.warn(`[Middleware] fetchProblemById: Problem not found in DB for ID: ${problemId}`);
            return next(errorHandler(404, `Problem not found with ID: ${problemId}`));
        }
        console.log("[Middleware] fetchProblemById: Successfully fetched problem from DB. ID:", problem._id, "Name:", problem.name);
        // console.log("[Middleware] fetchProblemById: Fetched problem object:", JSON.stringify(problem, null, 2)); // Uncomment for full problem object details

        // Attach the fetched problem object to the request object
        req.problem = problem;
        console.log("[Middleware] fetchProblemById: Attached fetched problem to req.problem. Proceeding to next middleware/controller.");

        next(); // Pass control to the next middleware in the stack

    } catch (error) {
        console.error("------------------- ERROR CAUGHT IN fetchProblemById MIDDLEWARE -------------------");
        console.error("[Middleware] fetchProblemById: ERROR CAUGHT - Message:", error.message);
        // Specifically check for CastError which often happens with invalid ObjectId formats
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            console.error("[Middleware] fetchProblemById: This looks like a CastError. The provided problemId might not be a valid MongoDB ObjectId format.");
            // You might want to return a more specific error to the client
            // return next(errorHandler(400, `Invalid Problem ID format: ${req.body.problemId}. Must be a valid ObjectId.`));
        }
        console.error("[Middleware] fetchProblemById: ERROR CAUGHT - Stack:", error.stack);
        console.error("-----------------------------------------------------------------------------------");
        next(error); // Pass the error to the global error handler
    }
};