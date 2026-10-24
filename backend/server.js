const app = require('./app');
const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test DB Connection before starting the HTTP server
db.query('SELECT NOW()')
  .then((res) => {
    console.log(`Connected to PostgreSQL database at ${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}`);
    console.log(`Database: ${process.env.PGDATABASE || 'eventnest_db'}`);
    
    app.listen(PORT, () => {
      console.log(`EventNest backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL database:', err.message);
    process.exit(1);
  });
