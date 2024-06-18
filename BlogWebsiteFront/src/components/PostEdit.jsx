import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const PostEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}`);
        const post = await response.json();
        if (response.ok) {
          setTitle(post.title);
          setContent(post.content);
        } else {
          throw new Error('Failed to fetch post');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  const handlePostEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('recaptchaToken', recaptchaToken);
    if(!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        alert('Post updated successfully');
        navigate(`/posts/${id}`);
      } else {
        throw new Error('Post update failed');
      }
    } catch (error) {
      console.error('Post update failed', error);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handlePostEdit}>
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
        <ReCAPTCHA
          sitekey="6Le33_YpAAAAAJfZFlSijhsa70YWxT2beWXENQq8"
          onChange={(token) => setRecaptchaToken(token)}
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default PostEdit;


