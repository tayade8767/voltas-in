import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = 3000;

// CORS Configuration: Allow requests from both frontend URLs (e.g., 5000 and 5173)
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true, // Allow cookies and authentication headers
}));

// Middleware
app.use(express.json());

// Routes
console.log("i am in index.js");
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(`mongodb+srv://akash:S6FIdYW0TFNDKc3T@cluster0.9z8eg.mongodb.net/voltasintern`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
