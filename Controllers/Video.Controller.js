import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import { v2 as cloudinary } from "cloudinary";
import uploadOnCloudinary from "../Middlewares/Cloudinary.js";
import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'
import { v4 as uuid } from 'uuid'

export const uploadvideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Video not sent!" });
        }

        const videoId = uuid();
        const inputPath = req.file.path;
        const outputRoot = path.join(process.cwd(), "hls-output", videoId);

        const resolutions = [
            { name: "360p", width: 640, height: 360, bitrate: "800k" },
            { name: "480p", width: 854, height: 480, bitrate: "1400k" },
            { name: "720p", width: 1280, height: 720, bitrate: "2800k" },
            { name: "1080p", width: 1920, height: 1080, bitrate: "5000k" }
        ];

        fs.mkdirSync(outputRoot, { recursive: true });

        const runCommand = (cmd) =>
            new Promise((resolve, reject) => {
                exec(cmd, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

        //  Extract duration
        const durationCommand = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
        const duration = await new Promise((resolve, reject) => {
            exec(durationCommand, (err, stdout) => {
                if (err) reject(err);
                else resolve(Math.floor(parseFloat(stdout)));
            });
        });

        //  Generate thumbnail
        const thumbnailPath = path.join(outputRoot, "thumbnail.jpg");
        await runCommand(
            `ffmpeg -i "${inputPath}" -ss 00:00:02 -vframes 1 "${thumbnailPath}"`
        );

        //  Transcode sequentially
        for (const r of resolutions) {
            const outputDir = path.join(outputRoot, r.name);
            fs.mkdirSync(outputDir, { recursive: true });

            const command = `
                ffmpeg -i "${inputPath}"
                -vf "scale=w=${r.width}:h=${r.height}"
                -c:v libx264 -b:v ${r.bitrate}
                -c:a aac -b:a 128k
                -f hls -hls_time 10 -hls_playlist_type vod
                -hls_segment_filename "${outputDir}/segment%03d.ts"
                "${outputDir}/index.m3u8"
            `;

            await runCommand(command);
        }

        //  Create master playlist
        const masterPlaylistPath = path.join(outputRoot, "master.m3u8");
        let masterContent = "#EXTM3U\n";

        for (const r of resolutions) {
            masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(
                r.bitrate
            ) * 1000},RESOLUTION=${r.width}x${r.height}\n`;
            masterContent += `${r.name}/index.m3u8\n`;
        }

        fs.writeFileSync(masterPlaylistPath, masterContent);

        //  Upload thumbnail
        const uploadedThumbnail = await cloudinary.uploader.upload(
            thumbnailPath,
            {
                folder: `videos/${videoId}`,
            }
        );

        //  Upload master playlist
        const uploadedMaster = await cloudinary.uploader.upload(
            masterPlaylistPath,
            {
                resource_type: "raw",
                folder: `videos/${videoId}`,
            }
        );

        //   Upload all .ts segments and playlists
        for (const r of resolutions) {
            const dir = path.join(outputRoot, r.name);
            const files = fs.readdirSync(dir);

            for (const file of files) {
                await cloudinary.uploader.upload(
                    path.join(dir, file),
                    {
                        resource_type: "raw",
                        folder: `videos/${videoId}/${r.name}`,
                    }
                );
            }
        }

        //  Cleanup local files
        fs.rmSync(outputRoot, { recursive: true, force: true });
        fs.unlinkSync(inputPath);

        return res.status(200).json({
            success: true,
            videoId,
            duration,
            hlsUrl: uploadedMaster.secure_url,
            thumbnail: uploadedThumbnail.secure_url
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Video processing failed",
            error: error.message
        });
    }
};


const getAllVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const matchStage = { isPublished: true };

        if (query) {
            matchStage.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ];
        }

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            matchStage.owner = new mongoose.Types.ObjectId(userId);
        }

        const sortStage = {
            [sortBy]: sortType === "asc" ? 1 : -1
        };

        const aggregate = Video.aggregate([
            { $match: matchStage },

            {
                $lookup: {
                    from: "users",
                    let: { ownerId: "$owner" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
                        {
                            $project: {
                                username: 1,
                                name: 1,
                                profileimage: 1
                            }
                        }
                    ],
                    as: "owner"
                }
            },
            { $unwind: "$owner" },

            { $sort: sortStage }
        ]);

        const options = {
            page: pageNumber,
            limit: limitNumber
        };

        const videos = await Video.aggregatePaginate(aggregate, options);

        return res.status(200).json({
            success: true,
            videos: videos.docs,
            totalDocs: videos.totalDocs,
            totalPages: videos.totalPages,
            page: videos.page,
            limit: videos.limit
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch videos",
            error: error.message
        });
    }
}

const publishAVideo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const videoLocalPath = req.files?.videoFile?.[0]?.path;

        if (!videoLocalPath) {
            return res.status(400).json({ message: "Video file is required" });
        }

        //  Transcode + Upload to Cloudinary
        const result = await uploadvideo(req, res);

        if (!result || !result.hlsUrl) {
            return res.status(400).json({ message: "Video processing failed" });
        }

        const newVideo = await Video.create({
            videoFile: result.hlsUrl,
            thumbnail: result.thumbnail,
            title,
            description,
            duration: result.duration,
            owner: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Video published successfully",
            video: newVideo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to publish video",
            error: error.message
        });
    }
};



const getVideoById = async (req, res) => {
     try {
        const { videoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }

        const video = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId),
                    isPublished: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { ownerId: "$owner" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
                        {
                            $project: {
                                username: 1,
                                name: 1,
                                profileimage: 1
                            }
                        }
                    ],
                    as: "owner"
                }
            },
            { $unwind: "$owner" }
        ]);

        if (!video.length) {
            return res.status(404).json({ message: "Video not found" });
        }

        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

        return res.status(200).json({
            success: true,
            video: video[0]
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch video",
            error: error.message
        });
    }
}

const updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        let updatedThumbnail = video.thumbnail;

        const thumbnailLocalPath = req.file?.path;

        // 🔹 If new thumbnail uploaded
        if (thumbnailLocalPath) {

            // delete old thumbnail from cloudinary
            if (video.thumbnail) {
                const parts = video.thumbnail.split("/");
                const publicId = parts.slice(parts.indexOf("videos")).join("/").split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // upload new thumbnail
            const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
            if (!uploadedThumbnail) {
                return res.status(400).json({ message: "Thumbnail upload failed" });
            }

            updatedThumbnail = uploadedThumbnail;
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title: title || video.title,
                    description: description || video.description,
                    thumbnail: updatedThumbnail
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Video updated successfully",
            video: updatedVideo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update video",
            error: error.message
        });
    }
};



const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // 🔹 delete entire folder from Cloudinary
        await cloudinary.api.delete_resources_by_prefix(`videos/${videoId}`);
        await cloudinary.api.delete_folder(`videos/${videoId}`);

        // 🔹 delete from database
        await Video.findByIdAndDelete(videoId);

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete video",
            error: error.message
        });
    }
};


const togglePublishStatus = async (req, res) => {
     try {
        const { videoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized to modify this video" });
        }

        video.isPublished = !video.isPublished;
        await video.save();

        return res.status(200).json({
            success: true,
            message: `Video ${video.isPublished ? "published" : "unpublished"} successfully`,
            isPublished: video.isPublished
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to toggle publish status",
            error: error.message
        });
    }
}

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
