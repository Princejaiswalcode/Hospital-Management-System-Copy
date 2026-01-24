import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { findUserByUsername } from '../models/user.model.js';

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required');
  }

  const users = await findUserByUsername(username);
  if (users.length === 0) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = users[0];
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      username: user.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          full_name: user.full_name
        }
      },
      'Login successful'
    )
  );
});
