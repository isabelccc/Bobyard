

const express = require ('express')

const cors = require('cors')

// config env file
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
const pool = require('./config/database');


async function initDB() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          text TEXT NOT NULL,
          author VARCHAR(150) DEFAULT 'Admin',
          likes INTEGER NOT NULL DEFAULT 0,
          images TEXT[] DEFAULT ARRAY[]::text[],
          parent_id INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('DB initialized: comments table ready');
    } catch (err) {
      console.error('DB init failed:', err);
      process.exit(1);
    }
  }

const commentRoutes = require('./routes/comment');
console.log("comment routes file loaded");
app.use('/comments', commentRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', database: 'PostgreSQL' });
  });

const PORT = process.env.PORT||5001;
initDB().then(()=>{
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
})

