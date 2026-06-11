import mongoose from "mongoose";
import envConfig from "./env.config.js";

export const dbConnecion = async () => {
    const conn = await mongoose.connect(envConfig.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
}
