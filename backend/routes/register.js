import express from "express";
import createUser from "../controllers/registerController.js";


const router = express.Router();

// POST http://localhost:5000/register
router.post("/", createUser);

export default router;