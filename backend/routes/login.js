import express from "express";
import checkValues from "../validators/checkValues.js";
import { loginPost } from "../controllers/loginController.js";

const router = express.Router();

router.post("/", checkValues(["username", "password"]), loginPost)

export default router;