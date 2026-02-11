import User from "../Models/User.Models"

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