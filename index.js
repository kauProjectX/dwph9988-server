import dotenv from 'dotenv';
import path from 'path';

const environment =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${environment}`),
});

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import memberRouter from './src/app/domain/member/memberRoute.js';
import shelterRouter from './src/app/domain/shelter/shelterRoute.js';
import heatRouter from './src/app/domain/heat/heatRoute.js';
import { swaggerUi, swaggerDocs } from './src/config/swagger/swagger.js';
import { errorMiddleware } from './src/app/global/errorHandler.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정
const corsOptions = {
  origin: [
    process.env.SERVICE_URL,
    'http://localhost:3000',
    'https://dwph9988.shop',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// preflight 요청을 위한 OPTIONS 처리
app.options('*', cors(corsOptions));

// Root path handler for basic check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    version: '1.0.0',
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
  });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/members', memberRouter);

// Error Handler
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
