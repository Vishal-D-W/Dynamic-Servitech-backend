import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import calculatorRoutes from './routes/calculator.js';
import activityRoutes from './routes/activity.js';

dotenv.config();

const app = express();

// CORS Configuration - allow local dev and Vercel preview/prod domains
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB (safe for serverless cold-start)
connectDB();

// Root route for uptime/status (so Vercel "Visit" doesn't show 404)
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'dynamic-servitech-backend',
    status: 'ok',
    docs: '/api',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/activity', activityRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// 404 Handler (only for API paths to not override static routing)
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handling
app.use(errorHandler);

// Do NOT call app.listen() on Vercel. Export the app as the serverless handler instead.
export default app;
