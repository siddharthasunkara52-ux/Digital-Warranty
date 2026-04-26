import express from "express";
import {
  getWarrantyByProduct,
  getMyWarrantyRecords,
} from "../controllers/warrantyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.get("/all", getMyWarrantyRecords);
router.get("/:productId", getWarrantyByProduct);

export default router;
