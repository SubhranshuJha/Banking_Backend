import mongoose from "mongoose";

async function connectDB() {
    if (!"mongodb://localhost:27017/banking_app") {
        throw new Error('MONGO_URI is not configured');
    }

    await mongoose.connect("mongodb://localhost:27017/banking_app");
    console.log('Connected to MongoDB');
}

export default connectDB;