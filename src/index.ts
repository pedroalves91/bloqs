import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import config from 'config';
import connectDB from './config/database';
import logger from './utils/logger.util';
import router from './routes/index.route';
import { errorHandler } from './middlewares';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', router);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();

        const PORT = config.get<number>('app.port');
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('❌ Failed to start the app:', error);
        process.exit(1);
    }
};

startServer();
