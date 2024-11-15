import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// 현재 환경의 서버 URL을 동적으로 결정하는 함수
const getServerUrl = () => {
  // SERVICE_URL이 있으면 그것을 사용
  if (process.env.SERVICE_URL) {
    return process.env.SERVICE_URL;
  }
  // 없으면 개발 환경으로 간주
  return 'http://localhost:3000';
};

// Swagger 설정 옵션
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProjectX API',
      version: '1.0.0',
      description: `더위피해9988 ${process.env.NODE_ENV === 'production' ? '운영' : '개발'} 서버 API 문서`,
    },
    externalDocs: {
      description: 'swagger.json',
      url: '/swagger.json',
    },
    servers: [
      {
        url: getServerUrl(),
        description: `${process.env.NODE_ENV === 'production' ? '운영' : '개발'} 서버`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '카카오 로그인 후 받은 JWT 토큰을 입력하세요',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/domain/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
};

export { swaggerUi, swaggerDocs, setupSwagger };
