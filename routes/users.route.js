import express from "express";
import { user, verifyOpt } from "../controller/user.controller.js";

const router = express.Router();

router.post("/user", user);
router.post("/verify-otp", verifyOpt);

export default router;
