import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const PostEdit = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // State to store access token
  const [userRole, setUserRole] = useState(""); // State to store user role

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (token) {
      setAccessToken(token);
    }
    if (role) {
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const post = await response.json();
        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error(error);
      }
    };
    if (accessToken) {
      fetchPost();
    }
  }, [id, accessToken]);

  const handlePostEdit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Access token not available");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    if (recaptchaToken) {
      formData.append("recaptchaToken", recaptchaToken);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/posts/${id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        alert("Post updated successfully");
        navigate(`/posts/${id}`);
      } else if (response.status === 403) {
        throw new Error("Unauthorized: You don't have permission to update this post");
      } else {
        const errorText = await response.json();
        throw new Error(`Post update failed: ${errorText.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error("Post update failed", error);
      alert("Post update failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!accessToken) {
      setError("Access token not available");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        alert("Post deleted successfully");
        navigate(`/`);
      } else if (response.status === 403) {
        throw new Error("Unauthorized: You don't have permission to delete this post");
      } else {
        const errorText = await response.json();
        throw new Error(`Post deletion failed: ${errorText.message}`);
      }
    } catch (error) {
      setError(error.message);
      console.error("Post deletion failed", error);
      alert("Post deletion failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handlePostEdit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <ReCAPTCHA
          sitekey="6Le33_YpAAAAAJfZFlSijhsa70YWxT2beWXENQq8"
          onChange={(token) => setRecaptchaToken(token)}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Update Post</button>
      </form>
      {userRole === "admin" && (
        <button onClick={handleDelete}>Delete Post</button>
      )}
    </div>
  );
};

export default PostEdit;





