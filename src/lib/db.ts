import mongoose from "mongoose";
import { env } from "@/env";

export const connectDB = async () => {
	try {
		await mongoose.connect(env.MONGO_URI);
	} catch (error) {
		console.error("Error connecting:", error);
	}
};
