export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),

  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://admin:password@localhost:5432/authdb',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'defaultSecretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecretKey',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshExpiresInMs:
      parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS || '604800000', 10) ||
      7 * 24 * 60 * 60 * 1000,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
});
