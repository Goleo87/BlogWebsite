import express from 'express';
import {  updateUser, deleteUser, getUserId } from '../controllers/usersController.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({ dest: 'public/' });

// GET http://localhost:5000/users/:id
router.get('/:id', getUserId);

// PATCH http://localhost:5000/users/:id
router.patch('/:id', upload.single('profileImage'), updateUser);

// DELETE http://localhost:5000/users/:id
router.delete('/:id', deleteUser);

export default router;


