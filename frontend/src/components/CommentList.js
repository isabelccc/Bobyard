import React, { useState, useEffect , useMemo} from 'react'
import { getComments, togglePin, updateStatus } from '../services/api'
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
            setComments(response.data.data)
            setLoading(false)

        } catch (err) {
            console.error('Error fetching comment', err)
            setLoading(false)
        }

    }
    const handleLike = (commentId, newLikesCount) => {
        setComments(prev =>
            prev.map(item =>
                item.id === commentId
                    ? { ...item, likes: newLikesCount }
                    : item
            )
        );
    }
    useEffect(() => {
        fetchComments()
    }, [])

    const handlePin = async(id) => {
        await togglePin(id);
        fetchComments();
      };
      const handleStatus = async(id, status)=>{
        try{
            await updateStatus(id, status);
            fetchComments();

        }
        catch(err){
            console.error(err)
        }
    }

 
    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="comment-list">
           
            <h2> Total comments : {comments.length}</h2>
            {
                comments.map(item => (
                    <CommentItem
                        key={item.id}
                        comment={item}
                        onUpdate={fetchComments}
                        onDelete={fetchComments}
                        onLike={handleLike}
                        onPin = {handlePin}
                        onStatus = {handleStatus}
                    />
                ))
            }


            <CommentForm onAdd={fetchComments} />

        </div>
    )
}

export default CommentList
