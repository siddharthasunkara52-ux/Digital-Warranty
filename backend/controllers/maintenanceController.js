import Maintenance from "../models/Maintenance.js";
import Product from "../models/Product.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import { canAccessProduct } from "../services/productService.js";


export const addMaintenance = asyncHandler(async (req, res) => {
  const { productId, serviceDate, description } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  const record = new Maintenance({ productId, serviceDate, description });
  await record.save();

  res.json({ message: "Maintenance added" });
});


export const getMaintenance = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  const records = await Maintenance.find({ productId }).sort({ serviceDate: -1 });
  res.json(records);
});


export const updateMaintenance = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, "Maintenance record not found");

  const product = await Product.findById(record.productId);
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  const { serviceDate, description } = req.body;
  if (serviceDate !== undefined) record.serviceDate = serviceDate;
  if (description !== undefined) record.description = description;

  await record.save();
  res.json({ message: "Maintenance record updated", record });
});


export const deleteMaintenance = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, "Maintenance record not found");

  const product = await Product.findById(record.productId);
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  await record.deleteOne();
  res.json({ message: "Maintenance record deleted" });
});


export const getUpcomingMaintenance = asyncHandler(async (req, res) => {
  const today = new Date();
  const query = { serviceDate: { $gte: today } };

  if (req.user.role !== "admin") {
    const userProducts = await Product.find({ userId: req.user._id }).select("_id");
    const productIds = userProducts.map((item) => item._id);
    query.productId = { $in: productIds };
  }

  const records = await Maintenance.find(query).sort({ serviceDate: 1 }).limit(20);
  res.json(records);
});