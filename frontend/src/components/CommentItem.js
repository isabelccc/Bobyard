import React , {useState, useEffect} from 'react';
import './CommentItem.css';
import { editComment, deleteComment, toggleLike, addComment } from '../services/api';
import CommentForm from './CommentForm';

export default function CommentItem({comment, onUpdate, onDelete,onLike}){
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text)
    const handleSave= async()=>{
        try{
            // id passed in prop
            await editComment (comment.id, editText)
            setIsEditing(false)
            // passed in prop
            onUpdate(); 
        }catch(err){
            console.error('Error editing comment', err)

        }
    }
    const [isLiked, setIsLiked] = useState(comment.likes > 0);
    
    // Sync isLiked state when comment prop changes
    useEffect(() => {
        setIsLiked(comment.likes > 0);
    }, [comment.likes]);
    
    const handleLike = async() => {
        try{
            // Fix typo: reponse -> response
            const response = await toggleLike(comment.id)
            const newLikesCount = response.data.likes
            onLike(comment.id, newLikesCount)
            // Update isLiked state based on new likes count (handles both true and false)
            setIsLiked(newLikesCount > 0)
        }catch(err){
            console.error('Failed to handle like count', err)
        }
    }
    const [replyingTo, setReplyingTo] = useState(null);
    
    
    
    const handleReply = () => {
        if (replyingTo === comment.id){
            setReplyingTo(null)
        } else {
            setReplyingTo(comment.id)
        }
    }
    
    
    const handleDelete = async()=>{
        if (window.confirm('Are you sure you want to delete this comment?')){
        try{
            await deleteComment(comment.id)
           // passed in prop
            onDelete();


        }catch (error) {
            console.error('Error deleting comment:', error);
          }}
        
    };
    return (
        <div className = "comment-item">
            <div className = "comment-header">
        <span className = "comment-author">
            {comment.author}

        </span>
                <span className = "comment-date"> {
                    new Date(comment.created_at).toLocaleString('en-US')}
        </span>
                {isEditing? (
                    <div>
                        <textarea value = {editText}
                        onChange = {(e)=> setEditText(e.target.value)}
                        className='edit-box'/>
                        <div className='edit-actions'>
                        <button className = "primary-btn" onClick = {handleSave}>Save</button>
                        <button className = "primary-btn" onClick = {()=> setIsEditing(false)}>
                            Cancel
                        </button>
                        </div>
        </div>
                ):(
                    <p className = "comment-text">{comment.text}</p>
                )}
                {comment.image && comment.images.length > 0 &&(
                    <div className='comment-images'>
                    {comment.images.map((img,idx)=>(
                            <img key = {idx} src= {img} alt = {`Comment ${idx}`}/>
                    ))}
                
                    </div>
                )}
                {!isEditing && (
                    <div className='comment-footer'>
                        <span className='comment-likes'>
                        ❤️ {comment.likes}
                        </span>
                        <div className = "comment-actions">
                            <button onClick = {()=> setIsEditing(true) } className = "primary-btn">Edit</button>
                            <button onClick ={handleDelete} className ="primary-btn">Delete</button>
                            <button onClick = {handleLike} className = "primary-btn">
                                {isLiked ? 'Unlike' : 'Like'}
                            </button>
                            <button className='primary-btn' onClick = {handleReply}> Reply</button>
                        </div>

                    </div>
                )}
                
                {replyingTo === comment.id && (
                    <div>
                        <CommentForm parentId={comment.id} onAdd={onUpdate} />
                        <button className="primary-btn" onClick={() => setReplyingTo(null)}>Cancel</button>
                    </div>
                )}

            </div>

        </div>

    );


}
