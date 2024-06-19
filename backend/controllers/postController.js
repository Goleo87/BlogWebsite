import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPost = new Post({
      title,
      content,
      image,
      user: user._id,
      userName: user.username,
      createdAt: new Date()
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}


export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
  next();
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req, res, next) => {
 

  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;
    const userId = req.user.id;
    const userRole = req.user.role;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.lastEditedAt = new Date();
    post.lastEditedBy = req.user.username;
    if (image) {
      post.image = image;
    }
    await post.save();
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
  next();
}



export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  next();
};


