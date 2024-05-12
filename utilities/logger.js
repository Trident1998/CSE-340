// utils/logger.js
const LogshqLogger = require('@logshq.io/node');

// Credentials
const logger = new LogshqLogger({
  project_id: 'SOME-PROJECT-ID',
  api_key: 'SOME-STREAM-KEY',
  environment: process.env.NODE_ENV, // optional
  hostname: 'auth-service', // optional
});