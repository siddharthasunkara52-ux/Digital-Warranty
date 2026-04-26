import cron from "node-cron";
import Product from "../models/Product.js";
import WarrantyRecord from "../models/WarrantyRecord.js";
import { NEAR_EXPIRY_DAYS } from "../config/constants.js";
import { calculateStatus } from "../services/productService.js";

export const runWarrantyCheck = async () => {
  console.log("[Cron] Running warranty reminder check...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threshold = new Date(today);
    threshold.setDate(today.getDate() + NEAR_EXPIRY_DAYS);

    // 1. Update status for near expiry products
    const nearExpiryProducts = await Product.find({
      expiryDate: { $gte: today, $lte: threshold }
    });

    for (const product of nearExpiryProducts) {
      const status = calculateStatus(product.expiryDate);

      if (product.status !== status) {
        product.status = status;
        await WarrantyRecord.findOneAndUpdate(
          { productId: product._id },
          { status },
          { upsert: false }
        );
        await product.save();
      }
    }

    // 2. Update status for expired products
    const expiredProducts = await Product.find({
      expiryDate: { $lt: today },
      status: { $ne: "Expired" }
    });

    for (const product of expiredProducts) {
      if (product.status !== "Expired") {
          product.status = "Expired";
          await WarrantyRecord.findOneAndUpdate(
            { productId: product._id },
            { status: "Expired" },
            { upsert: false }
          );
          await product.save();
      }
    }

    console.log("[Cron] Warranty reminder job completed.");
  } catch (error) {
    console.error("[Cron] Warranty reminder job failed:", error.message);
  }
};

const startCronJobs = () => {
  cron.schedule("0 9 * * *", runWarrantyCheck);
  console.log("[Cron] Warranty reminder job scheduled (daily at 9:00 AM).");
};

export default startCronJobs;
