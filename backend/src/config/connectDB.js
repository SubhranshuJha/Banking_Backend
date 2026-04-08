import mongoose from "mongoose";

function connectDB() {
    
    mongoose.connect("mongodb://localhost:27017/banking_app")
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    });

}

export default connectDB;