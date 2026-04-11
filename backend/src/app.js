import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';

import connectDB from './config/connectDB.js';
import authRouter from './routes/auth.routes.js';
import accountRouter from './routes/accounts.route.js';
import transactionRouter from './routes/transaction.route.js';

const PORT = Number(process.env.PORT) || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const currentFilePath = fileURLToPath(import.meta.url);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || origin === CLIENT_URL) {
            return callback(null, true);
        }

        return callback(new Error('CORS origin not allowed'));
    },
    credentials: true
};

const createApp = () => {
    const app = express();

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.get('/health', (_req, res) => {
        return res.status(200).json({ success: true, message: 'Server is healthy' });
    });

    app.use('/api/auth', authRouter);
    app.use('/api/accounts', accountRouter);
    app.use('/api/transactions', transactionRouter);

    app.use((req, res) => {
        return res.status(404).json({ success: false, message: 'Route not found' });
    });

    app.use((error, _req, res, _next) => {
        if (error.message === 'CORS origin not allowed') {
            return res.status(403).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    });

    return app;
};

const startServer = async () => {
    await connectDB();

    return new Promise((resolve) => {
        const server = createApp().listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            resolve(server);
        });
    });
};

if (process.argv[1] && currentFilePath === process.argv[1]) {
    startServer().catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
}

export { createApp, startServer };
