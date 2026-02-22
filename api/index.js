// Vercel serverless entry point - CommonJS to match backend output
const app = require('../apps/backend/dist/server').default;

module.exports = app;
