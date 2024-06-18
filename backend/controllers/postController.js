import Post from '../models/Post.js';

export const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;
  const userId = req.user.id; // Assuming req.user.id contains the authenticated user ID
  const userName = req.user.name; // Assuming req.user.name contains the authenticated user's name

  try {
    const newPost = new Post({
      title,
      content,
      image,
      user: userId,
      userName
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post', err);
    res.status(500).json({ message: 'Server error' });
  }
  next();
}


export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by descending createdAt
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts', err);
    res.status(500).json({ message: 'Server error' });
  }
  next();
};



export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post', err);
    res.status(500).json({ message: 'Server error' });
  }
  next();
};

export const getPostById = async (req, res , next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Error fetching post', err);
    res.status(500).json({ message: 'Server error' });
  }
  next();
}

export const getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts', err);
    res.status(500).json({ message: 'Server error' });
  }
  next();
};

export const createPostReply = async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.replies.push({
      content,
      user: userId
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error creating post reply', err);
    res.status(500).json({ message: 'Server error' });
  }
}