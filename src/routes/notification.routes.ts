import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

// Get all notifications for a user
router.get(
  '/user/:userId',
  verifyToken,
  notificationController.getUserNotifications.bind(notificationController),
);

// Create notification setting
router.post(
  '/',
  verifyToken,
  notificationController.createNotification.bind(notificationController),
);

// Delete notification setting
router.delete(
  '/:id',
  verifyToken,
  notificationController.deleteNotification.bind(notificationController),
);

export default router;
