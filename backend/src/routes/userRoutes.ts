import { Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
  changePassword,
} from "../controllers/UserController.js";
import { authenticateToken, requireRole } from "../middlewares/auth.js";
import { Role } from "../models/User.js";

const router = Router();

router.get("/", authenticateToken, getUsers as any);
router.get("/:id", authenticateToken, getUserById as any);
router.post("/", authenticateToken, requireRole([Role.Admin]), createUser as any);
router.put("/:id", authenticateToken, requireRole([Role.Admin]), updateUser as any);
router.delete("/:id", authenticateToken, requireRole([Role.Admin]), deleteUser as any);
router.post("/change-password", authenticateToken, changePassword as any);

export default router;
