import mongoose from "mongoose";

const warrantyRecordSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Near Expiry", "Expired"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

warrantyRecordSchema.index({ status: 1 });
warrantyRecordSchema.index({ expiryDate: 1 });

const WarrantyRecord = mongoose.model("WarrantyRecord", warrantyRecordSchema);
export default WarrantyRecord;
