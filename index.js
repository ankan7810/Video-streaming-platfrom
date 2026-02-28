import express from 'express';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet';
import connectdb from './Config/Db.js';
import cookieParser from 'cookie-parser';
import authrouter from './Routes/Auth.routes.js';
import videorouter from './Routes/Video.Routes.js';
import usserrouter from './Routes/User.Routes.js';
import playlistrouter from './Routes/Playlist.Routes.js';
import commentrouter from './Routes/Comment.Routes.js';
import likerouter from './Routes/Like.Routes.js';
import subscriptionrouter from './Routes/Subscription.Routes.js';
import cluster from "cluster";
import os from "os";
import process from "process";


dotenv.config({
    path:'./.env'
});

const port=process.env.PORT || 4000;
const app=express();

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // total windowms is 1 minutes
	limit: 5, // limit is 10 requests per 15 minutes
	message: 'Too many requests from this IP, please try again after 5 minutes',
})

connectdb();
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app,use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}))
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/videos", videorouter);
app.use("/api/v1/users", usserrouter);
app.use("/api/v1/playlists", playlistrouter);
app.use("/api/v1/likes", likerouter);
app.use("/api/v1/comments", commentrouter);
app.use("/api/v1/subscriptions", subscriptionrouter);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})


// dotenv.config({
//     path: './.env'
// });

// const port = process.env.PORT || 4000;
// const numCPUs = os.cpus().length;
// const MAX_WORHERS = 4; 

// if (cluster.isPrimary) {
//     console.log(`Forking ${MAX_WORHERS} workers...\n`);

//     for (let i = 0; i < 4; i++) {
// 		//fork() method is used to create a new worker process. Each worker runs the same code as the primary process, but they can handle requests independently.
//         cluster.fork();
//     }
// 	// Listen for dying workers and replace them
//     cluster.on("exit", (worker) => {
//         console.log(`Worker ${worker.process.pid} died. Restarting...`);
//         cluster.fork();
//     });
// } 
// //This block contains the code that each worker process will execute.
// else {
// const app = express();

// const limiter = rateLimit({
// 	windowMs: 1 * 60 * 1000, 
// 	limit: 8, 
// 	message: 'Too many requests from this IP, please try again after 5 minutes',
// })
	
// connectdb();

// app.use(helmet());
// app.use(limiter);
// //express.json() middleware is used to parse the incoming request body as JSON.
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(cookieParser());
// app.use("/api/v1/auth", authrouter);
// app.use("/api/v1/videos", videorouter);
// app.use("/api/v1/users", usserrouter);
// app.use("/api/v1/playlists", playlistrouter);
// app.use("/api/v1/likes", likerouter);
// app.use("/api/v1/comments", commentrouter);
// app.use("/api/v1/subscriptions", subscriptionrouter);

// app.listen(port, () => {
//         console.log(`Worker ${process.pid} running on port ${port}`);
//     });
// }
