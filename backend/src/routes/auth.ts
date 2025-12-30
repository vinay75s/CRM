import { Router } from "express";
import {
  login,
  getCurrentUser,
  logout,
  verifySess,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/verify", authenticateToken, verifySess);
router.post("/logout", authenticateToken, logout);

export default router;
