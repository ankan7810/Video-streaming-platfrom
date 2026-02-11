import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ 
    path:'./.env'
});

const connectdb=async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectdb;