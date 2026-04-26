import express from "express";
import { signup, login, getProfile, updateProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate, signupSchema, loginSchema } from "../middleware/validate.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;