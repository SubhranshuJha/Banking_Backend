import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import tokenBlacklistModel from "../models/blacklist.model.js";

const getToken = (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return req.cookies.token;
};

const verifyToken = (token) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.verify(token, jwtSecret);
};

const authMiddleware = async (req, res, next) => {
    try {
        const token = getToken(req);
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = verifyToken(token);
        const user = await userModel.findById(decoded.userId);
        if(!user){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

}


const authSystemUserMiddleware = async (req, res, next) => {
    try {
        const token = getToken(req);
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const isBlacklisted = await tokenBlacklistModel.findOne({ token});
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = verifyToken(token);
        const user = await userModel.findById(decoded.userId).select('+systemUser');
        if(!user || user.systemUser !== true){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

}  

export { authMiddleware, authSystemUserMiddleware };
