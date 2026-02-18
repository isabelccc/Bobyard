import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const getComments =()=>{
    return axios.get(`${API_URL}/comments`);
};
export const addComment = (text,images)=>{
    return axios.post(`${API_URL}/comments`,
        {text,images}
    );
};
export const toggleLike = (id, action)=>{
    return axios.put(`${API_URL}/comments/${id}/like`, { action });
}

export const editComment = (id, text)=>{
    return axios.put(`${API_URL}/comments/${id}`, {text});
};

export const deleteComment = (id)=>{
    return axios.delete(`${API_URL}/comments/${id}`);
};