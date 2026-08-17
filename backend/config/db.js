const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL 8.0 Connection Pool Configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'support_ticket_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test initial connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected successfully to MySQL 8.0 Database:', process.env.DB_NAME || 'support_ticket_db');
    connection.release();
  } catch (error) {
    console.warn('⚠️ Warning: Could not connect to standalone MySQL database. Ensure MySQL is running on port ' + (process.env.DB_PORT || '3306'));
    console.warn('   Error details:', error.message);
  }
};

module.exports = {
  pool,
  testConnection
};
