import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './interface/http/routes';
import { errorHandler } from './interface/http/middleware/errorHandler';
import { Logger } from './infrastructure/Logger';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1', routes);

// 404 Logger (Capture unmatched routes)
app.use((req, res, next) => {
    morgan('dev')(req, res, () => {
        Logger.warn(`Request not found: ${req.method} ${req.originalUrl}`);
        res.status(404).json({ error: `Path ${req.originalUrl} not found` });
    });
});

// Error Handler
app.use(errorHandler);

export default app;
