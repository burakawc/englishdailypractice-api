import { Request, Response } from 'express';
import { pool } from '../config/database';

export class NotificationController {
  // Get all notification settings for a user
  async getUserNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await pool.query(
        'SELECT * FROM notification_settings WHERE user_id = $1 ORDER BY time ASC',
        [userId],
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error getting notification settings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create notification setting
  async createNotification(req: Request, res: Response) {
    try {
      const { user_id, time, days, tense } = req.body;

      // Kullanıcının mevcut bildirim sayısını kontrol et
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM notification_settings WHERE user_id = $1',
        [user_id],
      );
      const notificationCount = parseInt(countResult.rows[0].count, 10);
      if (notificationCount >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Maksimum 5 bildirim oluşturulabilir.',
        });
      }

      const result = await pool.query(
        `INSERT INTO notification_settings 
        (user_id, time, days, tense) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [user_id, time, days, tense],
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error creating notification setting:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete notification setting
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM notification_settings WHERE id = $1 RETURNING *',
        [id],
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Notification setting not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting notification setting:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}
