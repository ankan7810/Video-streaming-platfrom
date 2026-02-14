import express from "express"
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../Controllers/Subscription.Controllers.js";
import isAuth from "../Middlewares/isAuth.js";

const subscriptionrouter = express.Router();

subscriptionrouter.get("/togglesubscription/:id",isAuth,toggleSubscription)
subscriptionrouter.get("/channelsubscribers/:id",isAuth,getUserChannelSubscribers)
subscriptionrouter.get("/mysubscription/:id",isAuth,getSubscribedChannels)

export default subscriptionrouter;