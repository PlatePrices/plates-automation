import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_DB_URL_CONNECTION
        ? process.env.MONGO_DB_URL_CONNECTION
        : ""
    );
    console.log("MongoDb connected");
  } catch (error) {
    console.error("MongoDb connection error:", error);
  }
};
