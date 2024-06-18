import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";

import { refreshTokens } from "../controllers/refreshTokenController.js";

const router = express.Router();
//import the authenticateToken middleware
router.use(authenticateToken);
//get http://localhost:5000/refresh-token
router.get("/", refreshTokens);

export default router;
