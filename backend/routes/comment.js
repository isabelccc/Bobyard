const express = require('express');
const router = express.Router();
const {
    getComments,
    createComment,
    toggleLike,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

router.get('/', getComments);
router.post('/', createComment);
router.put('/:id/like', toggleLike);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;