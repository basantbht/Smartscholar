import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "12345678";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin already exists:", adminEmail);
      process.exit(0);
    }

    const admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "Admin",
    });

    console.log("Admin created successfully:");
    console.log({
      email: admin.email,
      password: adminPassword,
      role: admin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ seedAdmin error:", err);
    process.exit(1);
  }
};

seedAdmin();
