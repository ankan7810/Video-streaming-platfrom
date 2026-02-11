import User from "../Models/User.Models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async(req, res) => {
    try {
        const {username, email, password,name,profileimage} = req.body;
        if (!username || !email || !password || !name || !profileimage) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        const existingUser=await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const existingUsername=await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
          if (!passwordRegex.test(password)) {
          return res.status(400).json({
            message:
              "Password must include letters, numbers, and special characters.",
          });
        }
        if(password.length<6){
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User.create({
            username,
            email,
            password: hashedPassword,
            name,
            profileimage
        });
        const token = await genToken(newUser._id);
        
        res.cookie("token", token, {
              httpOnly: true,
              //maxage: is in milliseconds, here it's set to 10 years
              maxAge: 15 * 24 * 60 * 60 * 1000,
              secure: false,
              sameSite: "Strict",
            });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Registration error: ${error}` });
    }
}

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Strict",
          });
        res.status(200).json({ message: "Login successfully" });  
    } catch (error) {
        return res.status(500).json({ message: `Login error: ${error}` });
    }
}

export const logoutUser = async(req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error}` });
    }
}

// export const forgotPassword = async(req, res) => {
//    try {
     
//    } catch (error) {
    
//    }
// }