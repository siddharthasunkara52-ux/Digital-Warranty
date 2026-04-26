import express from "express";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";
import {
  getAllAdminProducts,
  getAllUsers,
  deleteUser,
  getAdminDashboard,
} from "../controllers/adminController.js";

const router = express.Router();

const adminOnly = [verifyToken, checkRole("admin")];

router.get("/all-products", ...adminOnly, getAllAdminProducts);
router.get("/users", ...adminOnly, getAllUsers);
router.delete("/users/:id", ...adminOnly, deleteUser);
router.get("/dashboard", ...adminOnly, getAdminDashboard);

export default router;
