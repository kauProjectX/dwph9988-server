// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 설정 옵션
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Swagger 버전
    info: {
      title: 'ProjectX',
      version: '1.0.0',
      description: 'API documentation for projextX',
    },
    servers: [
      {
        url: 'http://localhost:3000', // 서버 URL
      },
    ],
  },
  apis: ['./src/app/domain/**/*.js'], // API 파일 경로
};

// Swagger Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
