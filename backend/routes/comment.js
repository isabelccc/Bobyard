const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /comments - List all comments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM comments ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /comments - Add new comment

router.post('/', async(req, res)=>{
    try{
        const {text, author,images,likes} = req.body
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
       
        const result = await pool.query(
            `INSERT INTO comments(text, author,images,likes)
             VALUES($1, $2, $3, $4)
             RETURNING *`,
             [text, author || 'Admin',images|| [], likes || 0]
          );
      
          res.json({ message: 'Added New comment', data: result.rows[0] });
    }
    catch(error){
        console.error('Error adding comments:', error);
        res.status(500).json({ error: error.message });
    }
})


  
// PUT /comments/:id/like - Toggle like (must be before /:id route)
router.put('/:id/like', async(req, res) => {
    try {
        const id = req.params.id;
        
        // Get current likes
        const current = await pool.query(
            'SELECT likes FROM comments WHERE id = $1',
            [id]
        );
        
        if (current.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        const currentLikes = current.rows[0].likes;
        // Toggle: if 0, make it 1; if > 0, make it 0
        const newLikes = currentLikes === 0 ? 1 : 0;
        
        const result = await pool.query(
            `UPDATE comments 
             SET likes = $1,
                 updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [newLikes, id]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async(req, res)=>{
    try{
        const id = req.params.id 
        const text = req.body.text
        if (!text){
            return res.status(404).json({message: "No message provided"})
        }
        const result = await pool.query(
            `UPDATE comments 
            SET text = $1,
            updated_at = NOW()
            WHERE id = $2
            RETURNING *`,
            [text, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'comment not found' });
        }
          res.json({ message: 'Updated', data: result.rows[0] });
    }catch (err){
        console.error(err);
        res.status(500).json({err: err.message})
    }
})

router.delete('/:id', async(req, res)=>{
    try{
    const id = req.params.id
    const result =  await pool.query(
        `
        DELETE FROM comments
        WHERE id = $1
        RETURNING *
        `,[id]
    )
    if (result.rows.length == 0){
        return res.status(404).json({error: "Comment not found"})
    }
    res.json({ message: 'Deleted', data: result.rows[0] });
}
catch(err){
    console.error(err)
    res.status(500).json({err: err.message})
}
})







module.exports = router;