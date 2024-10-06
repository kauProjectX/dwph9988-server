import 'dotenv/config';
import express from 'express';
import { swaggerUi, swaggerDocs } from './src/config/swagger/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger 경로 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 기본 경로 설정
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
