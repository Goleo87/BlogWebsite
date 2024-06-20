import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateToken;

