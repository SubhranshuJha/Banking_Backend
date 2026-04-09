import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccount , getUserAccount , getAccountBalance} from '../controller/account.controller.js';

const accountRouter = express.Router();

accountRouter.post('/create', authMiddleware, createAccount ) ;
accountRouter.get('/get', authMiddleware, getUserAccount ) ;
accountRouter.get('/balance/:accountId', authMiddleware, getAccountBalance ) ;


export default accountRouter ;
