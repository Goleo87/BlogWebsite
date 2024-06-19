import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connect from "./libs/database.js";
import postRoutes from "./routes/post.js";
import registerRouter from "./routes/register.js";
import usersRouter from "./routes/users.js";
import refreshTokensRouter from "./routes/refresh.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { loginPost } from "./controllers/loginController.js";

dotenv.config(); // Load environment variables from .env file

await connect();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/register", registerRouter);
app.use("/login", loginPost);
app.use("/users", usersRouter);
app.use("/posts", postRoutes);

app.use("/refresh-token", refreshTokensRouter);

// Global error handler
app.use(globalErrorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
