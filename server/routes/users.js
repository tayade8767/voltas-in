import express from 'express';
import { z } from 'zod';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';
import { log } from 'three/examples/jsm/nodes/Nodes.js';

const router = express.Router();

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin']).optional()
});

// Get all users (admin only)
router.get('/allusers', async (req, res, next) => {
  console.log("all users get")
  try {
    // if (req.user.role !== 'admin') {
    //   throw new ApiError(403, 'Admin access required');
    // }

    const users = await User.find({}, '-password');

    console.log(users)
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = updateUserSchema.parse(req.body);

    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ApiError(403, 'Unauthorized to update this user');
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, select: '-password' }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// invite new user

router.post('/invite', auth, async (req, res, next) => {
  // console,log("enter in invite")
  try {
    // console.log("model role == ",req.user.role);
    if (req.user.role === 'admin') {
      throw new ApiError(403, 'Admin access required');
    }

    const { name, email, role } = req.body;

    console.log(req.body);

    if (!name || !email || !role) {
      throw new ApiError(400, 'Name, email, and role are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = new User({ name, email, role, password: 'temporarypassword' });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User invited successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});


// Delete user (admin only)
router.delete('/:id', auth, async (req, res, next) => {
  console.log(req.user.role);
  try {
    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Admin access required');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;