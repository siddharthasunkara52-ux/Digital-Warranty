import Product from "../models/Product.js";
import WarrantyRecord from "../models/WarrantyRecord.js";
import Maintenance from "../models/Maintenance.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import {
  calculateStatus,
  normalizeWarrantyMonths,
  ensureStatus,
  canAccessProduct,
  buildProductQuery,
} from "../services/productService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    purchaseDate,
    warrantyPeriod,
    warrantyUnit = "months",
    category = "Electronics",
    invoiceFile,
  } = req.body;

  const warrantyMonths = normalizeWarrantyMonths(warrantyPeriod, warrantyUnit);
  if (!productName || !purchaseDate || warrantyMonths <= 0) {
    throw new ApiError(400, "Invalid product data");
  }

  const purchase = new Date(purchaseDate);
  const expiryDate = new Date(purchase);
  expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);

  const status = calculateStatus(expiryDate);

  const product = new Product({
    userId: req.user._id,
    productName,
    purchaseDate,
    warrantyPeriod: warrantyMonths,
    category,
    expiryDate,
    status,
    invoiceFile,
  });

  await product.save();

  await WarrantyRecord.create({
    productId: product._id,
    expiryDate,
    status,
  });

  res.status(201).json({
    message: "Product added successfully",
    expiryDate,
    status,
    product,
  });
});


export const uploadInvoice = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) throw new ApiError(400, "Product ID is required");
  if (!req.file) throw new ApiError(400, "Invoice file is required");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  if (product.invoiceFile) {
    const oldPath = path.join(__dirname, "..", product.invoiceFile.replace(/^\//, ""));
    fs.unlink(oldPath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.warn("[Upload] Could not delete old invoice:", err.message);
      }
    });
  }

  product.invoiceFile = `/uploads/${req.file.filename}`;
  await product.save();

  res.json({ message: "Invoice uploaded successfully", invoiceFile: product.invoiceFile });
});


export const getProducts = asyncHandler(async (req, res) => {
  const query = buildProductQuery(req);
  const products = await Product.find(query).populate("userId", "name email role");
  const updatedProducts = await Promise.all(products.map((p) => ensureStatus(p)));

  res.json(updatedProducts);
});


export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("userId", "name email role");
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  await ensureStatus(product);
  res.json(product);
});


export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  const {
    productName,
    purchaseDate,
    warrantyPeriod,
    warrantyUnit = "months",
    category,
    invoiceFile,
  } = req.body;

  if (productName !== undefined) product.productName = productName;
  if (purchaseDate !== undefined) product.purchaseDate = purchaseDate;
  if (category !== undefined) product.category = category;
  if (warrantyPeriod !== undefined) {
    product.warrantyPeriod = normalizeWarrantyMonths(warrantyPeriod, warrantyUnit);
  }
  if (invoiceFile !== undefined) product.invoiceFile = invoiceFile;

  if (product.purchaseDate && product.warrantyPeriod !== undefined) {
    const expiryDate = new Date(product.purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + product.warrantyPeriod);
    product.expiryDate = expiryDate;
    product.status = calculateStatus(expiryDate);

    await WarrantyRecord.findOneAndUpdate(
      { productId: product._id },
      { expiryDate: product.expiryDate, status: product.status },
      { upsert: true }
    );
  }

  await product.save();
  res.json({ message: "Product updated successfully", product });
});


export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  if (product.invoiceFile) {
    const filePath = path.join(__dirname, "..", product.invoiceFile.replace(/^\//, ""));
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.warn("[Delete] Could not delete invoice file:", err.message);
      }
    });
  }

  await WarrantyRecord.deleteOne({ productId: product._id });
  await Maintenance.deleteMany({ productId: product._id });
  await product.deleteOne();

  res.json({ message: "Product deleted successfully" });
});


export const getNotifications = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const products = await Product.find(query);
  const updatedProducts = await Promise.all(products.map((p) => ensureStatus(p)));

  const nearExpiry = updatedProducts.filter((p) => p.status === "Near Expiry");
  const expired = updatedProducts.filter((p) => p.status === "Expired");

  res.json({ nearExpiry, expired });
});


export const getStats = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const products = await Product.find(query);
  const updatedProducts = await Promise.all(products.map((p) => ensureStatus(p)));

  const total = updatedProducts.length;
  const active = updatedProducts.filter((p) => p.status === "Active").length;
  const expired = updatedProducts.filter((p) => p.status === "Expired").length;
  const nearExpiry = updatedProducts.filter((p) => p.status === "Near Expiry").length;

  res.json({ total, active, expired, nearExpiry });
});