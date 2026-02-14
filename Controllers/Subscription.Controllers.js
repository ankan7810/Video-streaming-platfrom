import mongoose, {isValidObjectId} from "mongoose"
import User from "../Models/User.Models.js"
import subscription from "../Models/Subscription.Models.js"

export const toggleSubscription = async (req, res) => {
try {
    const {channelId, subscriberId} = req.params
    const channel = await User.findById(channelId)
    if(!channel){
        return res.status(400).json({message:"channel not found"})
    }
    const subscriber = await User.findById(subscriberId)
    if(!subscriber){
        return res.status(400).json({message:"subscriber not found"})
    }
    const alreadySubscribed=await subscription.findOne({
        subscriber:subscriberId,
        channel:channelId
    })
    if(alreadySubscribed){
        await subscription.findOneAndDelete(alreadySubscribed._id)
        return res.status(200).json({message:"Unsubscribed successfully"})
    }
    await subscription.create({
        subscriber:subscriberId,
        channel:channelId
    })
    return res.status(200).json({message:"subscriber subscribed successfully"})
} catch (error) {
    return res.status(500).json({message:"internal server error"})
}
}

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = async (req, res) => {
    try {
        const {channelId} = req.params
        const channel = await User.findById(channelId)
        if(!channel){
            return res.status(400).json({message:"channel not found"})
        }
        const subscribers = await subscription.find({channel:channelId}).populate("subscriber","username email")
        return res.status(200).json({subscribers})
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }           
}

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = async (req, res) => {
    try {
        const {subscriberId} = req.params
        const subscriber = await User.findById(subscriberId)
        if(!subscriber){
            return res.status(400).json({message:"subscriber not found"})
        }
        const channels = await subscription.find({subscriber:subscriberId}).populate("channel","username email")
        return res.status(200).json({channels})
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }   
}