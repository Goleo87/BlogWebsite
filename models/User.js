import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from "validator";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Username must be at least 5 characters long"],
    maxlength: [20, "Username must be at most 20 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Email is invalid"
    }
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin"]
  },
 
});

// Middleware to hash password before saving user to database
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = model('User', userSchema);

export default User;


