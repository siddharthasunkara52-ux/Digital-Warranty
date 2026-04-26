import { MS_PER_DAY, NEAR_EXPIRY_DAYS } from "../config/constants.js";



export const calculateStatus = (expiryDate) => {
  if (!expiryDate) return "Active";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expiry = new Date(expiryDate);
  const expiryOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const diffDays = Math.ceil((expiryOnly - today) / MS_PER_DAY);

  if (diffDays < 0) return "Expired";
  if (diffDays <= NEAR_EXPIRY_DAYS) return "Near Expiry";
  return "Active";
};



export const normalizeWarrantyMonths = (period, unit = "months") => {
  const value = Number(period);
  if (Number.isNaN(value) || value < 0) return 0;
  return unit === "years" ? value * 12 : value;
};



export const ensureStatus = async (product) => {
  if (!product) return product;

  const status = calculateStatus(product.expiryDate);
  if (product.status !== status) {
    product.status = status;
    await product.save();
  }
  return product;
};



export const canAccessProduct = (product, user) => {
  if (!product || !user) return false;
  if (user.role === "admin") return true;
  return product.userId?.toString() === user._id.toString();
};



export const buildProductQuery = (req) => {
  const { search, status, filter, userId, category } = req.query;
  const query = {};

  if (search) {
    query.productName = { $regex: search, $options: "i" };
  }

  const effectiveStatus = status || (filter && filter !== "All" ? filter : undefined);
  if (effectiveStatus) {
    query.status = effectiveStatus;
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (req.user.role !== "admin") {
    query.userId = req.user._id;
  } else if (userId) {
    query.userId = userId;
  }

  return query;
};
