import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PostDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

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
      } else if (response.status === 403) {
        throw new Error('Unauthorized: You do not have permission to delete this post');
      } else {
        throw new Error('Post deletion failed');
      }
    } catch (error) {
      setError(error.message);
      console.error('Post deletion failed', error);
    }
  };

  return (
    <div className="container">
      <h2>Are you sure you want to delete this post?</h2>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleDelete}>Yes, delete it</button>
      <button onClick={() => navigate('/dashboard')}>No, take me back</button>
    </div>
  );
};

export default PostDelete;
