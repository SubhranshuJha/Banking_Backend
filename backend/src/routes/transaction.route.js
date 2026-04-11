import express from 'express';
import { authMiddleware, authSystemUserMiddleware } from '../middleware/auth.middleware.js';
import { createTransaction, systemInitialFunds } from '../controller/transaction.controller.js';

const transactionRouter = express.Router();

transactionRouter.post('/create', authMiddleware, createTransaction ) ;
transactionRouter.post('/system-initialFunds', authSystemUserMiddleware ,systemInitialFunds ) ;
transactionRouter.post('/system-initial-funds', authSystemUserMiddleware, systemInitialFunds);


export default transactionRouter;
