import User from "../Models/User.Models"
import { v2 as cloudinary } from "cloudinary";

export const getcurrentUser = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({message:"Current user fetched successfully", user});
    } catch (error) {
        return res.status(400).json({message: "Error fetching user data", error: error.message});
    }
}

export const updateAccountDetails = async (req, res) => {
    try {
        const { username, email } = req.body;
        const profileimageLocalPath = req.file?.path;

        if (!profileimageLocalPath) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        const existingUser = await User.findById(req.user._id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        //  Delete old image from Cloudinary (if exists)
        if (existingUser.profileimage) {
            //why split because we need to get the public id of the image which is the last part of the url after the last "/"
            const urlParts = existingUser.profileimage.split("/");
            const fileName = urlParts[urlParts.length - 1];
            const publicId = fileName.split(".")[0]; // remove extension

            await cloudinary.uploader.destroy(publicId);
        }

        const profileImage = await uploadOnCloudinary(profileimageLocalPath);

        if (!profileImage?.url) {
            return res.status(400).json({ message: "Error while uploading profile image" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    username,
                    email,
                    profileImage: profileImage.url
                }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Account details updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating account details",
            error: error.message
        });
    }
};


export const getUserChannelProfile = async(req, res) => {
    try {
         const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            //$match is used to filter the documents in the collection based on the specified condition
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            //project used for selecting the fields that we want to return in the response
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new Error("Channel not found")
    }

    return res.status(200).json({message: "User channel fetched successfully", channel: channel[0]});
    } catch (error) {
        return res.status(500).json({message: "Error fetching user channel profile", error: error.message});
    }
}

export const getWatchHistory = async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200).json(user[0].watchHistory);
}