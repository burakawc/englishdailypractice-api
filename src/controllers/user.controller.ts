import { Request, Response } from 'express';
import { pool } from '../config/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserController {
  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM users ORDER BY created_at DESC',
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error getting users:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [
        id,
      ]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error getting user:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // Create user
  async createUser(req: Request, res: Response) {
    try {
      const {
        first_name,
        last_name,
        email,
        notification_token,
        notification_enabled,
        device_type,
        device_version,
        device_model,
        device_name,
      } = req.body;

      // Check if email already exists
      if (email) {
        const existingUser = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email],
        );
        if (existingUser.rows.length > 0) {
          return res
            .status(409)
            .json({ success: false, message: 'Email already exists' });
        }
      }

      // Insert user
      const result = await pool.query(
        `INSERT INTO users 
        (first_name, last_name, email, notification_token, notification_enabled, 
         device_type, device_version, device_model, device_name) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          first_name,
          last_name,
          email,
          notification_token,
          notification_enabled,
          device_type,
          device_version,
          device_model,
          device_name,
        ],
      );

      // Generate JWT token
      const token = jwt.sign(
        { id: result.rows[0].id, email: result.rows[0].email },
        JWT_SECRET,
      );

      res.status(201).json({
        user: result.rows[0],
        token,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        first_name,
        last_name,
        email,
        notification_token,
        notification_enabled,
        device_type,
        device_version,
        device_model,
        device_name,
      } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id],
      );
      if (existingUser.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      // Check if new email already exists (only if email is provided and different from current)
      if (email && email !== existingUser.rows[0].email) {
        const emailExists = await pool.query(
          'SELECT * FROM users WHERE email = $1 AND id != $2',
          [email, id],
        );
        if (emailExists.rows.length > 0) {
          return res
            .status(409)
            .json({ success: false, message: 'Email already exists' });
        }
      }

      // Update user
      const result = await pool.query(
        `UPDATE users 
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            email = COALESCE($3, email),
            notification_token = COALESCE($4, notification_token),
            notification_enabled = COALESCE($5, notification_enabled),
            device_type = COALESCE($6, device_type),
            device_version = COALESCE($7, device_version),
            device_model = COALESCE($8, device_model),
            device_name = COALESCE($9, device_name)
        WHERE id = $10 
        RETURNING *`,
        [
          first_name,
          last_name,
          email,
          notification_token,
          notification_enabled,
          device_type,
          device_version,
          device_model,
          device_name,
          id,
        ],
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}
