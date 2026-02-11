import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
    path:'./.env'
});

//100 mail per day limit in gmail
const transporter = nodemailer.createTransport({
	host:'smtp.gmail.com',
	port:587,
	secure:false,
	auth:{
		user:process.env.EMAIL,
		pass:process.env.EMAIL_PASSWORD
	}
})

export const sendOtpMail=async (to,otp) => {
    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject:"Reset Your Password",
        html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}

export const sendRegistertationMail=async(to,name) => {
    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject:"Welcome to Our Platform",
        html:`<p>Welcome to our platform ${name}!.</p>`
    })
}