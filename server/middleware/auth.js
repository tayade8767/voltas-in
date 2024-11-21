import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

// Ensure this is set from environment variables or falls back to a default.
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-jwt-key";

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET); // Use JWT_SECRET defined above.
    req.user = decoded;
    // console.log(token);
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message); // Log detailed error for debugging.
    next(new ApiError(401, 'Invalid token'));
  }
};
