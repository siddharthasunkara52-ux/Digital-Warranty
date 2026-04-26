import WarrantyRecord from "../models/WarrantyRecord.js";
import Product from "../models/Product.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import { canAccessProduct } from "../services/productService.js";


export const getWarrantyByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (!canAccessProduct(product, req.user)) throw new ApiError(403, "Access denied");

  const record = await WarrantyRecord.findOne({ productId });
  if (!record) throw new ApiError(404, "Warranty record not found");

  res.json(record);
});


export const getMyWarrantyRecords = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const products = await Product.find(query).select("_id");
  const productIds = products.map((p) => p._id);

  const records = await WarrantyRecord.find({ productId: { $in: productIds } })
    .populate({
      path: "productId",
      select: "productName category purchaseDate warrantyPeriod userId",
      populate: { path: "userId", select: "name email" },
    })
    .sort({ expiryDate: 1 });

  res.json(records);
});
