import express from 'express';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet';

dotenv.config({
    path:'./.env'
});
const port=process.env.PORT || 4000;
const app=express();

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // it means 15 minutes which is 
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	message: 'Too many requests from this IP, please try again after 5 minutes',
})

app.use(helmet());
app.use(limiter);
app.use(express.json());

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})