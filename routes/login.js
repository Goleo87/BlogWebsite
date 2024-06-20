import express from "express";
import checkValues from "../validators/checkValues.js";
import { loginUser } from "../controllers/loginController.js";

const router = express.Router();

router.post("/", checkValues(["username", "password"]), loginUser)

export default router;