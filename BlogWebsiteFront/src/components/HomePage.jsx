// HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/posts');
        if (response.ok) {
          const posts = await response.json();
          setPosts(posts);
        } else {
          throw new Error('Failed to fetch posts');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container">
      <div className="post-list">
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            <h2>{post.title}</h2>
            <div>
              {post.image && <img src={`http://localhost:5000/${post.image}`} alt="Post" className="post-image" />}
            </div>
            <p>{post.content}</p>
            <div className="post-meta">
            <p>Posted by: {post.user.username} at:{new Date(post.createdAt).toLocaleString()}</p>
            </div>
            {isAuthenticated && (
              <>
                <Link to={`/edit-post/${post._id}`} className="edit-button">Edit</Link>
                <Link to={`/delete-post/${post._id}`} className="delete-button">Delete</Link>
              </>
            )}
          </div>
        ))}
      </div>
      {isAuthenticated && (
        <button
          className="post-actions-button"
          onClick={() => navigate('/create-post')}
        >
          Create New Post
        </button>
      )}
    </div>
  );
};

export default HomePage;












