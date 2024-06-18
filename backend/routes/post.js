import express from 'express';
import Post from '../models/Post.js';
import multer from 'multer';
import authenticateToken from '../middleware/authenticateToken.js';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', [authenticateToken, upload.single('image')], async (req, res) => {
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
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {

  try {
    const post = await Post.findById(req.params.id).populate('user', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate('user', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
)




router.get('/user/:userId/posts/:postId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId });
    const post = posts.find(post => post._id.toString() === req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  }
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
)





router.patch('/:id', [authenticateToken, upload.single('image')], async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (image) {
      post.image = image;
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;



