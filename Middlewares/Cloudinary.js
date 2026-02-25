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
        let optimizedUrl = null;

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
         if (resourceType === "image") {
        const optimizedImageUrl = cloudinary.url(result.public_id, {
        resource_type: "image",
        fetch_format: "auto",
        quality: "auto",
        width: 800,
        crop: "scale"
      });

      return optimizedImageUrl;
    }
    return result.secure_url;

    } catch (error) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        throw error;
    }
};

export default uploadOnCloudinary;
