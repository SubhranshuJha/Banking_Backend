import express from 'express';
import { registerUser , loginUser , userLogOut } from '../controller/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', userLogOut);

export default authRouter ;