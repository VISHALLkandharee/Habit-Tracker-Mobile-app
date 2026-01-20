import mongoose from "mongoose";

interface databaseConection {
  isConnected?: number;
}

const connected: databaseConection = {};

const connectDB = async (): Promise<void> => {
  if (connected.isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI || "", {});

    // Set the connection state
    connected.isConnected = mongoose.connections[0].readyState;

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
