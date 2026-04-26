import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  serviceDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;