import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import warrantyRoutes from "./routes/warrantyRoutes.js";
import startCronJobs from "./jobs/cronJobs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;




app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (process.env.NODE_ENV !== "production") return cb(null, true);
      if (!origin) return cb(null, true);
      if (allowed.length === 0) return cb(new Error("CORS origin not configured"), false);
      
      if (allowed.includes(origin)) {
        return cb(null, true);
      } else {
        return cb(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/warranty", warrantyRoutes);

app.get("/", (req, res) => {
  res.json({ status: "API is running", env: process.env.NODE_ENV });
});

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  startCronJobs();
});