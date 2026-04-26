import express from "express";
import {
  addProduct,
  getProducts,
  getStats,
  uploadInvoice,
  updateProduct,
  deleteProduct,
  getNotifications,
  getProductById,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate, addProductSchema } from "../middleware/validate.js";

const router = express.Router();

router.post("/add", verifyToken, validate(addProductSchema), addProduct);
router.post("/upload-invoice", verifyToken, upload.single("invoice"), uploadInvoice);
router.get("/all", verifyToken, getProducts);
router.get("/stats", verifyToken, getStats);
router.get("/notifications", verifyToken, getNotifications);
router.get("/:id", verifyToken, getProductById);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;