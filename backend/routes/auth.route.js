import express from "express";
import {SignUp,login,Logout} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup",SignUp);
router.post("/login",login);
router.get("/logout", Logout);
export default router;
