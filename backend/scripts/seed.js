const fs = require('fs/promises');
const path = require('path');
const pool = require('../config/database');

async function seedComments() {
  const filePath = path.resolve(__dirname, '../../comments.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  const comments = Array.isArray(parsed.comments) ? parsed.comments : [];

  if (comments.length === 0) {
    console.log('No comments found in comments.json');
    return;
  }

  await pool.query('BEGIN');

  try {
    //Deletes ALL rows from the table
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY');

    const insertSql = `
      INSERT INTO comments (text, author, likes, images, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;

    for (const item of comments) {
      const text = (item.text || '').trim();
      const author = (item.author || 'Admin').trim();
      const likes = Number.isFinite(Number(item.likes)) ? Number(item.likes) : 0;
      const createdAt = item.date ? new Date(item.date) : new Date();
      const images = item.image && item.image.trim() !== '' ? [item.image.trim()] : [];

      if (!text) {
        continue;
      }

      await pool.query(insertSql, [text, author, likes, images, createdAt]);
    }

    await pool.query('COMMIT');
    console.log(`Seeded ${comments.length} comments from comments.json`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

seedComments()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
