import express from 'express';
import { registerUser , loginUser , userLogOut } from '../controller/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', authMiddleware, userLogOut);

export default authRouter ;