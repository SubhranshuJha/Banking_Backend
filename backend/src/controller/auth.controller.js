import tokenBlacklistModel from "../models/blacklist.model.js";
import userModel from "../models/user.model.js";
import { sendRegisterEmail } from "../services/email.service.js";
import jwt from 'jsonwebtoken';


const buildCookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
});


const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject();
    delete user.password;
    return user;
};


const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ success: false, message: 'email, name and password are required' });
        }

        const isExist = await userModel.findOne({ email });

        if(isExist){
            return res.status(422).json({  success: false, message: "User already exists" });
        }

        const user = await userModel.create({
            email,
            name,
            password
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('token', token, buildCookieOptions());
        // await sendRegisterEmail(user.email, user.name);
        return res.status(201).json({  success: true, message: "User registered successfully", user: sanitizeUser(user), token });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'email and password are required' });
        }

        const user = await userModel.findOne({ email }).select('+password');
        if(!user){
            return res.status(404).json({  success: false, message: "User not found" });
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({  success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('token', token, buildCookieOptions());
        return res.status(200).json({  success: true, message: "User logged in successfully", user: sanitizeUser(user), token });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}    

const userLogOut = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(400).json({  success: false, message: "No token provided" });
        }

        res.clearCookie('token', buildCookieOptions());
        await tokenBlacklistModel.create({ token });
        return res.status(200).json({  success: true, message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, userLogOut }