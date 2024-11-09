const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN;

  if (!secret) {
    console.error('Current environment variables:', process.env);
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return {
    secret,
    expiresIn: expiresIn || '24h',
  };
};

export const AUTH_CONFIG = {
  get jwt() {
    return getJwtConfig();
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
