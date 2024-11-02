import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import memberRouter from './src/app/domain/member/memberRoute.js';
import { swaggerUi, swaggerDocs } from './src/config/swagger/swagger.js';
import { errorMiddleware } from './src/app/global/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/members', memberRouter);

// Error Handler
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
