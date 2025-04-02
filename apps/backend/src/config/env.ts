export const config = {
  port: process.env.PORT || 4001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: process.env.DATABASE_URL || '',
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || ''
  }
};
