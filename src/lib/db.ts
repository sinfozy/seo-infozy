import mongoose from "mongoose";
import { seedPlans } from "./seedPlans";

type ConnectionObj = {
  isConnected?: number;
};

const connection: ConnectionObj = {};

const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDb URI is not available!");
  }

  try {
    const dbInstance = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = dbInstance.connections[0].readyState;

    console.log("DB Connected!");

    // Seed plans right after connecting
    await seedPlans();
  } catch (err) {
    console.error("dbConnection failed: ", err);
    throw err;
  }
};

export default connectDB;
