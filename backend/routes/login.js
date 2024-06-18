import express from "express";
import checkValues from "../validators/checkValues.js";
import { loginPost } from "../controllers/loginController.js";

const router = express.Router();

// POST http://localhost:5000/login
router.post("/", checkValues(["username", "password"]), loginPost)

export default router;