import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/post.js';
import registerUser from './routes/register.js';
import UsersRouter from './routes/users.js';
import refreshTokensRouter from './routes/refresh.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import authenticateToken from './middleware/authenticateToken.js';
import { loginUser } from './controllers/loginController.js';



const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//* Store your own MongoDB connection string in .env file!
try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Database is connected! 🐱");
  } catch (error) {
    console.log(error.message);
    console.log("Database connection failed... :(");
  }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/register', registerUser);
app.use('/login', loginUser);
app.use('/users', authenticateToken, UsersRouter);
app.use('/posts', postRoutes);
app.use('/refresh-token', refreshTokensRouter);

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


