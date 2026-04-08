import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import tokenBlacklistModel from "../models/blacklist.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, wrhj243y84h2u3h4);
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
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const isBlacklisted = await tokenBlacklistModel.findOne({ token});
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, wrhj243y84h2u3h4);
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