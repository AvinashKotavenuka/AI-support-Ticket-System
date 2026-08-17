const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test MySQL connection on server boot
testConnection();

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Node.js Express REST API Server running on port ${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - Authentication: http://localhost:${PORT}/api/auth`);
  console.log(`   - Tickets:        http://localhost:${PORT}/api/tickets`);
  console.log(`   - Dashboard:      http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`   - Health Check:   http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
