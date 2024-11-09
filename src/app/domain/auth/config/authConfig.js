export const AUTH_CONFIG = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
    type: 'Bearer',
  },
};

export const AUTH_SWAGGER_CONFIG = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};
