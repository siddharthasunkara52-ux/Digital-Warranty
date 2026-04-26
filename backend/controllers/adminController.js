import Product from "../models/Product.js";
import User from "../models/User.js";
import Maintenance from "../models/Maintenance.js";
import WarrantyRecord from "../models/WarrantyRecord.js";
import { asyncHandler } from "../middleware/errorHandler.js";


export const getAllAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("userId", "name email role");
  const users = await User.find().select("-password");

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    active: products.filter((p) => p.status === "Active").length,
    expired: products.filter((p) => p.status === "Expired").length,
    nearExpiry: products.filter((p) => p.status === "Near Expiry").length,
  };

  const recentActivity = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((product) => ({
      id: product._id,
      productName: product.productName,
      user: product.userId ? product.userId.name : "Unknown",
      createdAt: product.createdAt,
    }));

  res.json({ products, users, stats, recentActivity });
});


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});


export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const products = await Product.find({ userId: id });
  const productIds = products.map((product) => product._id);

  await WarrantyRecord.deleteMany({ productId: { $in: productIds } });
  await Maintenance.deleteMany({ productId: { $in: productIds } });
  await Product.deleteMany({ userId: id });
  await user.deleteOne();

  res.json({ message: "User and related products deleted" });
});


export const getAdminDashboard = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  const products = await Product.find();
  const maintenance = await Maintenance.find().sort({ serviceDate: 1 }).limit(10);

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    active: products.filter((p) => p.status === "Active").length,
    expired: products.filter((p) => p.status === "Expired").length,
    nearExpiry: products.filter((p) => p.status === "Near Expiry").length,
    upcomingMaintenance: maintenance.filter((m) => new Date(m.serviceDate) >= new Date()).length,
  };

  res.json({ users, products, maintenance, stats });
});
