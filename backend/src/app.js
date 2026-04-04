import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/connectDB.js';
import authRouter from './routes/auth.routes.js';
import accountRouter from './routes/accounts.route.js';
import transactionRouter from './routes/transaction.route.js';


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configure
connectDB();


// Routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);


app.listen( 8000 , () => {
    console.log('Server is running on port 8000');
});