import React, { useState } from 'react';
import './CommentForm.css';
import { addComment } from '../services/api';

export default function CommentForm({ onAdd }) {
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([])
 
    
    
    const handleImageUpload = async(e)=>{
        const files = Array.from(e.target.files);
        files.forEach(file =>{
            const reader = new FileReader();
            reader.onloadend =()=>{
                setSelectedImages(prev => [...prev, reader.result])
            };
            reader.readAsDataURL(file);

        })

    }

    const handleSubmit = async () => {
       
        
        // Validation
        const hasText = textInput && textInput.trim() !== '';
        const hasImages = selectedImages && selectedImages.length >0
        if (!hasImages && !hasText){
            console.error('Nothing to submit, please type or upload image')
            return
        }
        

        try {
            setLoading(true)
            
            const response = await addComment(textInput,selectedImages);

            if (response.status === 201) {
                setTextInput('');
                setSelectedImages([])
                onAdd();
            } else {
                console.error('failed to add new comment')
            }

            setLoading(false)

        } catch (err) {
            console.error('Error adding comment:', err);
            setLoading(false)
        }
    }
    const removeImage = (idx) => {
        setSelectedImages(prev =>
            // val and i 
          prev.filter((_, i) => i !== idx)
        )
      }

    return (
        <div className='comment-submit'>
            <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className='submit-box'
                placeholder="Write a comment..."
            />
            <p className = "inputCount">{textInput.length}/500</p>
           <label className='upload-btn'> 
                <img src="/upload.png" alt="upload" className="upload-icon"/>
                <input type="file" id="imageUpload" onChange = {handleImageUpload} accept="image/*" hidden/>


            </label>
            
           
            {selectedImages.length > 0 && (
                    <div className="image-preview">
                        {selectedImages.map((img, idx) => (
                            <div key={idx}>
                                <img src={img} alt={`Preview ${idx}`} />
                                <button className="primary-btn" onClick={() => removeImage(idx)}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            <button
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    )
}
