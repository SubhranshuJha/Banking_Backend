import mongoose from "mongoose";

async function connectDB() {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/banking_app";

    if (!mongoUri) {
        throw new Error('MONGO_URI is not configured');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
}

export default connectDB;
