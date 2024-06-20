import express from "express";
import registerUser from "../controllers/registerController.js";



const router = express.Router();

// POST http://localhost:5000/register
router.post("/", registerUser);

export default router;