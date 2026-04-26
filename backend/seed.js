import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";
import WarrantyRecord from "./models/WarrantyRecord.js";
import Maintenance from "./models/Maintenance.js";

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/warrantyDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const seed = async () => {
  try {
    console.log("Clearing existing data...");
    await Maintenance.deleteMany({});
    await WarrantyRecord.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log("Creating Admin User (admin123)...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "admin123",
      email: "admin123@admin.com",
      password: adminPassword,
      role: "admin",
      phone: "+1 800-ADMIN"
    });

    console.log("Creating Standard User (fsd123)...");
    const userPassword = await bcrypt.hash("123456", 10);
    const fsdUser = await User.create({
      name: "fsd123",
      email: "fsd123@user.com",
      password: userPassword,
      role: "user",
      phone: "+1 555-0192",
      address: "123 Main St, New York, NY"
    });

    console.log("Seeding Products + WarrantyRecords for fsd123...");
    const today = new Date();
    const fsdId = fsdUser._id;

    const active1Date = new Date(today); active1Date.setDate(today.getDate() + 60);
    const active2Date = new Date(today); active2Date.setDate(today.getDate() + 120);
    const near1Date = new Date(today); near1Date.setDate(today.getDate() + 2);
    const near2Date = new Date(today); near2Date.setDate(today.getDate() + 3);
    const near3Date = new Date(today); near3Date.setDate(today.getDate() + 5);
    const near4Date = new Date(today); near4Date.setDate(today.getDate() + 6);
    const expired1Date = new Date(today); expired1Date.setDate(today.getDate() - 10);

    const products = await Product.create([
      { productName: "MacBook Pro M3", purchaseDate: new Date(today.getTime() - 300 * 86400000), expiryDate: active1Date, warrantyPeriod: 12, status: "Active", category: "Electronics", userId: fsdId },
      { productName: "Samsung 4K Smart TV", purchaseDate: new Date(today.getTime() - 200 * 86400000), expiryDate: active2Date, warrantyPeriod: 12, status: "Active", category: "Electronics", userId: fsdId },
      { productName: "Dell UltraSharp Monitor", purchaseDate: new Date(today.getTime() - 363 * 86400000), expiryDate: near1Date, warrantyPeriod: 12, status: "Near Expiry", category: "Electronics", userId: fsdId },
      { productName: "Logitech MX Master 3", purchaseDate: new Date(today.getTime() - 362 * 86400000), expiryDate: near2Date, warrantyPeriod: 12, status: "Near Expiry", category: "Electronics", userId: fsdId },
      { productName: "Sony WH-1000XM5 Headphones", purchaseDate: new Date(today.getTime() - 360 * 86400000), expiryDate: near3Date, warrantyPeriod: 12, status: "Near Expiry", category: "Electronics", userId: fsdId },
      { productName: "Dyson V15 Vacuum", purchaseDate: new Date(today.getTime() - 359 * 86400000), expiryDate: near4Date, warrantyPeriod: 12, status: "Near Expiry", category: "Appliances", userId: fsdId },
      { productName: "Apple iPhone 13 Pro", purchaseDate: new Date(today.getTime() - 400 * 86400000), expiryDate: expired1Date, warrantyPeriod: 12, status: "Expired", category: "Electronics", userId: fsdId }
    ]);

    const warrantyRecords = products.map((p) => ({
      productId: p._id,
      expiryDate: p.expiryDate,
      status: p.status,
    }));
    await WarrantyRecord.create(warrantyRecords);
    console.log(`Created ${warrantyRecords.length} WarrantyRecords.`);

    const macbook = products[0];
    const monitor = products[2];
    await Maintenance.create([
      { productId: macbook._id, serviceDate: new Date(today.getTime() - 60 * 86400000), description: "Battery health check and keyboard cleaning" },
      { productId: macbook._id, serviceDate: new Date(today.getTime() - 30 * 86400000), description: "macOS update and disk optimization" },
      { productId: monitor._id, serviceDate: new Date(today.getTime() - 90 * 86400000), description: "Dead pixel inspection and firmware update" },
    ]);
    console.log("Created 3 Maintenance records.");

    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seed();
