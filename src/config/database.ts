import mongoose from 'mongoose';
import config from 'config';
import logger from '../utils/logger.util';

const dbURI: string = config.get<string>('db.uri');

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(dbURI);
        logger.info('✅ Connected to MongoDB');
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        throw new Error('MongoDB connection failed');
    }
};

export default connectDB;
