import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  updateUSER,
  deleteUSER,
  getProblems,
  getSubmissions,
} from "../controllers/user.controller.js";
import { fetchProblemById } from "../utils/fetchProblem.js";
// import { getUserProblems } from "../controllers/problems.controller.js";
const router = express.Router();
//why did we use verifyToken here?
// The verifyToken middleware is used to ensure that the user is authenticated before allowing them to update their profile.
// can u explain me the post request in the context of this route?
// In this context, the POST request to "/update/:id" is used to update a user's profile information.
// The ":id" parameter in the URL represents the unique identifier of the user whose profile is being updated.
// The verifyToken middleware checks if the user is authenticated before proceeding with the update operation.
router.post("/update/:id", verifyToken, updateUSER);
router.delete("/delete/:id", verifyToken, deleteUSER);
router.get("/:userid/problems", verifyToken, getProblems);
router.get("/:userid/submissions", verifyToken,getSubmissions);

export default router;
