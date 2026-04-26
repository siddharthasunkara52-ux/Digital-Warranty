import express from "express";
import {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getUpcomingMaintenance,
} from "../controllers/maintenanceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.post("/add", addMaintenance);
router.get("/upcoming", getUpcomingMaintenance);
router.get("/:productId", getMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

export default router;