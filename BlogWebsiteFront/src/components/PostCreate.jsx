import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handlePostCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        alert('Post created successfully');
        navigate('/dashboard');
      } else {
        throw new Error('Post creation failed');
      }
    } catch (error) {
      console.error('Post creation failed', error);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handlePostCreate}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default PostCreate;





