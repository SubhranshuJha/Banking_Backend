import tokenBlacklistModel from "../models/blacklist.model.js";
import userModel from "../models/user.model.js";
import sendEmail, { sendRegisterEmail } from "../services/email.service.js";
import jwt from 'jsonwebtoken';



const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    const isExist = await userModel.findOne({ email });

    if(isExist){
        return res.status(422).json({  success: false, message: "User already exists" });
    }

    const user = await userModel.create({
        email,
        name,
        password
    });

    const token = jwt.sign({ userId: user._id }, wrhj243y84h2u3h4, { expiresIn: '3d' });
    res.cookie('token', token, { httpOnly: true });
    // await sendRegisterEmail(user.email, user.name);
    return res.status(201).json({  success: true, message: "User registered successfully", user , token });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password'); 
    if(!user){
        return res.status(404).json({  success: false, message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        return res.status(401).json({  success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie('token', token, { httpOnly: true });
    return res.status(200).json({  success: true, message: "User logged in successfully", user , token });
}    

const userLogOut = async (req, res) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(400).json({  success: false, message: "No token provided" });
    }

    res.clearCookie('token');
    await tokenBlacklistModel.create({ token });
    return res.status(200).json({  success: true, message: "User logged out successfully" });
}

export { registerUser, loginUser, userLogOut }