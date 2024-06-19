import createError from "http-errors";
import User from "../models/User.js";

export async function getUserData(req, res, next) {
  let foundUser;

  // Try to find the user in the "users" collection based on the :id parameter
  try {
    foundUser = await User.findById(req.params.id);
  } catch {
    return next(createError(500, "Server error"));
  }

  // If the user exists in the "users" collection
  if (foundUser) {
    try {
      await foundUser.populate("articles", {
        _id: 1,
        title: 1,
        deletedAt: 1
      })

      // Send the server response
      res.status(201).json({
        username: foundUser.username,
        articles: foundUser.articles.filter(article => article.deletedAt === null)
      })
    } catch {
      next(createError(500, "Server error"));
    }
  } else {
    next(createError(404, "User not found"));
  }
}

export async function addNewArticle(req, res, next) {
  const { ArticleId } = req.body;

  let foundUser;

  // Try to find the user in the "users" collection based on the :id parameter
  try {
    foundUser = await User.findById(req.params.id);
  } catch {
    return next(createError(500, "Server error"));
  }

  // If the user exists in the "users" collection
  if (foundUser) {
    try {
      const options = {
        new: true,
        runValidators: true
      }

      // Update the user document with the ArticleId received in the req body
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {$push: {articles: ArticleId}}, options);
  
      // Populate the user document's "Articles" array before sending the server response
      await updatedUser.populate("articles", {
        _id: 1,
        title: 1,
        deletedAt: 1
      })

      // Send the server response
      res.status(201).json({
        id: updatedUser._id,
        username: updatedUser.username,
        articles: updatedUser.articles.filter(article => article.deletedAt === null)
      })
    } catch {
      next(createError(500, "Server error"));
    }

  } else {
    next(createError(404, "User not found"));
  }
}

// Function to "hard" delete a "user" document
export async function deleteUser(req, res, next) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (deletedUser) {
      res.json({
        message: "User deleted successfully"
      })
    } else {
      next(createError(404, "User not found"));
    }

  } catch {
    next(createError(500, "Server error"));
  }
}