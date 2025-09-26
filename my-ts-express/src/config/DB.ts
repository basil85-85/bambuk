import mongoose from "mongoose";

class Database {
  private static instance: Database;
  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  public async connect(): Promise<void> {
    try {
      const mongoUrl = process.env.MONGO_URL;
      if (!mongoUrl) throw new Error("MONGO_URL is not defined in .env");

      await mongoose.connect(mongoUrl);
      console.log(" MongoDB connected Database class");
    } catch (err) {
      console.error(" MongoDB connection error:", err);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("🛑 MongoDB disconnected");
    } catch (err) {
      console.error("❌ MongoDB disconnection error:", err);
    }
  }
}

export default Database;
