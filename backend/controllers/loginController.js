import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/User.js";


// Function to log in the user
export const loginPost = async (req, res, next) => {
  const { username, password, recaptchaToken } = req.body;

  let foundUser;

  try {
    // Check if the user exists in the "users" collection
    foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return next(
        createError(401, "Login unsuccessful - please check your details")
      );
    }
  } catch {
    return next(createError(500, "Server error"));
  }

  if (foundUser) {
    const accessToken = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: foundUser.id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      id: foundUser._id,
      username: foundUser.username,
      accessToken,
      refreshToken,
    });
  } else {
    next(createError(401, "Login unsuccessful - please check your details"));
  }
};
