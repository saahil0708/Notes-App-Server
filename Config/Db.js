import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (req, res) => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database Connected, Connection Name: ${connection.connection.name}`);
        
    } catch (error) {
        console.error(`Connection Failed: ${error}`);
        process.exit(1);
    }
}

export default connectDB;