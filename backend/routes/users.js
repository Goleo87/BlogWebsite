import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { addNewArticle, getUserData, deleteUser } from "../controllers/usersController.js";
import authorizeRole from "../middleware/authorizeRole.js";
import checkValues from "../validators/checkValues.js";

const router = express.Router();

// Use authentication middleware to protect all /users routes
router.use(authenticateToken)

// GET http://localhost:5000/users/:id
router.get("/:id", getUserData)

// PATCH http://localhost:5000/users/:id/articles
router.patch("/:id/articles", checkValues(["id"]), addNewArticle)

// DELETE http://localhost:5000/users/:id
router.delete("/:id", authorizeRole ("admin"), deleteUser)


export default router;