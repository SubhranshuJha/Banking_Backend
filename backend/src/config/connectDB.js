import mongoose from "mongoose";

<<<<<<< HEAD
async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured');
    }
=======
function connectDB() {
    
    mongoose.connect("mongodb://localhost:27017/banking_app")
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    });
>>>>>>> 359d5bcba6a8d93ed60d97976cff3211b50c773f

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
}

export default connectDB;