import React , {useState} from 'react';
import './CommentForm.css';
import { addComment } from '../services/api';

export default function CommentForm({onAdd, parentId = null}){
    const [textInput, setTextInput] = useState('');
    const [imageInput, setImageInput] = useState([])
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async()=>{
        // Validation
        if (!textInput || textInput.trim() === ''){
            console.error('Text input cannot be empty');
            return;
        }
        
        try{
            setLoading(true)
            const response = await addComment(textInput, imageInput, parentId);
            
            if (response.status === 200){
                setTextInput('');
                onAdd();
            }else{
                console.error('failed to add new comment')
            }
            
            setLoading(false)

        }catch(err){
            console.error('Error adding comment:', err);
            setLoading(false)
        }
    }
    
    return (
        <div className='comment-submit'>
            <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className='submit-box'
                placeholder="Write a comment..."
            />
            
            <button 
                disabled={loading} 
                onClick={handleSubmit}
                className='submit-btn'
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    )
}
