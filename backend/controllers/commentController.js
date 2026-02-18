const pool = require('../config/database');

const getComments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*)::int AS total FROM comments');
    const result = await pool.query(
      'SELECT * FROM comments ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const total = countResult.rows[0].total;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      data: result.rows,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { text, author, images, likes } = req.body;
    const hasText = typeof text === 'string' && text.trim() !== '';
    const hasImages = Array.isArray(images) && images.length > 0;

    if (!hasText && !hasImages) {
      return res.status(400).json({ error: 'Text or image is required' });
    }

    const result = await pool.query(
      `INSERT INTO comments (text, author, images, likes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [text || '', author || 'Admin', images || [], likes || 0]
    );

    res.status(201).json({ message: 'Added new comment', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const id = req.params.id;
    const current = await pool.query('SELECT likes FROM comments WHERE id = $1', [id]);

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const newLikes = current.rows[0].likes === 0 ? 1 : 0;

    const result = await pool.query(
      `UPDATE comments
       SET likes = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [newLikes, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { text } = req.body;
    const hasText = typeof text === 'string' && text.trim() !== '';

    if (!hasText) return res.status(400).json({ error: 'Please provide text' });

    const result = await pool.query(
      `UPDATE comments
       SET text = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [text, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Comment not found' });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Comment not found' });

    res.json({ message: 'Deleted', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getComments,
  createComment,
  toggleLike,
  updateComment,
  deleteComment
};