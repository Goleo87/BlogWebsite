import express from "express";
import multer from "multer";
import authenticateToken from "../middleware/authenticateToken.js";
import {
  createPost,
  deletePost,
  updatePost,
  getPosts,
  getPostById,
} from "../controllers/postController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", [authenticateToken, upload.single("image"), createPost]);

router.patch("/:id", [authenticateToken, upload.single("image"), updatePost]);

router.delete("/:id", authenticateToken, deletePost);

router.get("/", getPosts);

router.get("/:id", getPostById);

export default router;
