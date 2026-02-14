import React, { useState, useEffect } from 'react'
import { getComments } from '../services/api'
import CommentItem from './CommentItem'
import CommentForm from './CommentForm'
import "./CommentList.css"

function CommentList() {

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchComments = async () => {
        setLoading(true)
        try {
           
            const response = await getComments()
            const allComments = response.data
        
            const topLevelComments = allComments.filter(c => !c.parent_id);
            
            const commentWithReplies = topLevelComments.map((c) => {
                const replies = allComments.filter((r) => {
            
                    return r.parent_id != null && Number(r.parent_id) === Number(c.id);
                });
                return {
                    ...c,
                    replies: replies
                };
            });
            setComments(commentWithReplies)
            setLoading(false)

        } catch (err) {
            console.error('Error fetching comment', err)
            setLoading(false)
        }

    }
    const handleLike = (commentId, newLikesCount) => {
        setComments(prev =>
           
            prev.map(item => {
                // Update top-level comment
                if (item.id === commentId) {
                    return { ...item, likes: newLikesCount };
                }
                // Update reply if it matches
                if (item.replies?.some(r => r.id === commentId)) {
                    return {
                        ...item,
                        replies: item.replies.map(r =>
                            r.id === commentId ? { ...r, likes: newLikesCount } : r
                        )
                    };
                }
                return item;
            })
        );
    }
    
    useEffect(() => {
        fetchComments()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="comment-list">
            <h2>Comments {comments.length}</h2>
            {comments.map(item => (
                <div key={item.id}>
                    <CommentItem comment={item} onUpdate={fetchComments} onDelete={fetchComments} onLike={handleLike} />

                   
                    {item.replies?.map(r => (
                        <div key={r.id} style={{ marginLeft: '20px' }} className="nested-reply">
                            <CommentItem comment={r} onUpdate={fetchComments} onDelete={fetchComments} onLike={handleLike} />
                        </div>
                    ))}
                </div>
            ))}

            <CommentForm onAdd={fetchComments} />

        </div>
    )
}

export default CommentList
