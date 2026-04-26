import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  warrantyPeriod: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    enum: ["Electronics", "Appliances", "Furniture", "Automotive", "Software", "Other"],
    default: "Electronics",
  },
  expiryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Active", "Near Expiry", "Expired"],
    default: "Active",
  },
  invoiceFile: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ userId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ expiryDate: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;