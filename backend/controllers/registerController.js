import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import createError from "http-errors";
import User from "../models/User.js";

async function createUser(req, res, next) {
  const { email, username, password } = req.body;

  try {
    const foundUser = await User.findOne({ $or: [{ email }, { username }] });

    if (foundUser) {
      if (foundUser.email === email) {
        return next(createError(409, "Email address already in use. Please try a different email address"));
      }
      if (foundUser.username === username) {
        return next(createError(409, "Username has already been taken. Please try a different username"));
      }
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({ email, username, password: hashedPassword });

    const newToken = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ id: newUser.id, username: newUser.username, token: newToken  });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errMsg = Object.values(err.errors)[0].message;
      return next(createError(400, errMsg));
    }
    next(createError(500, "Registration could not be completed. Please try again"));
  }
}

export default createUser;

