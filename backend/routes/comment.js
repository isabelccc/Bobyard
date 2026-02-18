const express = require('express');
const router = express.Router();
const {
    getComments,
    createComment,
    toggleLike,
    updateComment,
    deleteComment,
    togglePin,
    updateStatus
} = require('../controllers/commentController');

const commentRateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function rateLimitCreateComment(req, res, next) {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const requests = commentRateLimitStore.get(key) || [];
    const recentRequests = requests.filter((ts) => ts > windowStart);

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - recentRequests[0]);
        const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
        return res.status(429).json({
            error: 'Too many comments. Please wait before posting again.',
            retryAfterSeconds
        });
    }

    recentRequests.push(now);
    commentRateLimitStore.set(key, recentRequests);
    next();
}

router.get('/', getComments);
router.post('/', rateLimitCreateComment, createComment);
router.put('/:id/like', toggleLike);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.patch('/:id/pin', togglePin);
router.patch('/:id/status', updateStatus);

module.exports = router;