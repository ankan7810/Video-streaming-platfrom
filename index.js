// import express from 'express';
// import dotenv from 'dotenv';
// import { rateLimit } from 'express-rate-limit'
// import helmet from 'helmet';
// import connectdb from './Config/Db.js';
// import cookieParser from 'cookie-parser';

// dotenv.config({
//     path:'./.env'
// });
// const port=process.env.PORT || 4000;
// const app=express();

// const limiter = rateLimit({
// 	windowMs: 5 * 60 * 1000, // it means 15 minutes which is 
// 	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	message: 'Too many requests from this IP, please try again after 5 minutes',
// })

// connectdb();
// app.use(helmet());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(limiter);
// app.use(express.json());

// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`);
// })




import cluster from "cluster";
import os from "os";
import process from "process";

import express from 'express';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import connectdb from './Config/Db.js';
import cookieParser from 'cookie-parser';

dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 4000;
const numCPUs = os.cpus().length;
const MAX_WORHERS = 4; 

if (cluster.isPrimary) {
    console.log(`Forking ${MAX_WORHERS} workers...\n`);

    for (let i = 0; i < 4; i++) {
		//fork() method is used to create a new worker process. Each worker runs the same code as the primary process, but they can handle requests independently.
        cluster.fork();
    }
	// Listen for dying workers and replace them
    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} 
//else block: This block contains the code that each worker process will execute.
else {
    const app = express();

    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 10,
        message: 'Too many requests from this IP, please try again after 5 minutes',
    });
	
    connectdb();

    app.use(helmet());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(limiter);
    app.use(express.json());
    app.use('/hls-output', express.static(path.join(process.cwd(), 'hls-output')))

    app.listen(port, () => {
        console.log(`Worker ${process.pid} running on port ${port}`);
    });
}