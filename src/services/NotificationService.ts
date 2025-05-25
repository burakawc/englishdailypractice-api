import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { pool } from '../config/database';

const expo = new Expo();

export class NotificationService {
  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: any,
  ) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return false;
    }

    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    try {
      const chunks = expo.chunkPushNotifications([message]);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending push notification:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in sendPushNotification:', error);
      return false;
    }
  }

  async getUsersToNotify() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get HH:mm format
    const currentDay = this.getCurrentDayInTurkish();

    const query = `
      SELECT u.id, u.notification_token, ns.tense
      FROM users u
      JOIN notification_settings ns ON u.id = ns.user_id
      WHERE u.notification_enabled = true
      AND u.notification_token IS NOT NULL
      AND ns.time = $1
      AND $2 = ANY(ns.days)
      AND ns.is_clicked = false
    `;

    const result = await pool.query(query, [currentTime, currentDay]);
    return result.rows;
  }

  private getCurrentDayInTurkish(): string {
    const days = [
      'Pazar',
      'Pazartesi',
      'Salı',
      'Çarşamba',
      'Perşembe',
      'Cuma',
      'Cumartesi',
    ];
    return days[new Date().getDay()];
  }

  async markNotificationAsClicked(userId: number) {
    await pool.query(
      'UPDATE notification_settings SET is_clicked = true WHERE user_id = $1',
      [userId],
    );
  }
}
