// PostDelete.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PostDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        alert('Post deleted successfully');
        navigate('/dashboard');
      } else {
        throw new Error('Post deletion failed');
      }
    } catch (error) {
      console.error('Post deletion failed', error);
    }
  };

  return (
    <div className="container">
      <h2>Are you sure you want to delete this post?</h2>
      <button onClick={handleDelete}>Yes, delete it</button>
      <button onClick={() => navigate('/')}>No, take me back</button>
    </div>
  );
};

export default PostDelete;





