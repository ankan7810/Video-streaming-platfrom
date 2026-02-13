import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file) => {
    try {
        const ext = path.extname(file).toLowerCase();

        let options = {};

        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
            options.resource_type = "image";
        } 
        else if (ext === ".mp4" || ext === ".mov" || ext === ".mkv") {
            options.resource_type = "video";
        } 
        else {
            options.resource_type = "raw";
        }

        const result = await cloudinary.uploader.upload(file, options);

        fs.unlinkSync(file);

        return result.secure_url;

    } catch (error) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        throw error;
    }
};

export default uploadOnCloudinary;
