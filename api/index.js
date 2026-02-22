// Vercel serverless entry point
// Uses esbuild-bundled backend (handles CJS/ESM interop)
const app = require('../apps/backend/dist/server.bundle.cjs');

module.exports = app.default || app;
