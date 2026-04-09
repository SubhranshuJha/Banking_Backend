import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/connectDB.js';
import authRouter from './routes/auth.routes.js';
import accountRouter from './routes/accounts.route.js';
import transactionRouter from './routes/transaction.route.js';


const app = express();
const PORT = Number(process.env.PORT) || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configure
app.get('/health', (_, res) => {
    return res.status(200).json({ success: true, message: 'Server is healthy' });
});


// Routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transactions', transactionRouter);

app.use((req, res) => {
    return res.status(404).json({ success: false, message: 'Route not found' });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
