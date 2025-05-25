import { NotificationService } from './NotificationService';
import { TENSE_OPTIONS } from '../types/tense.types';
import { NotificationQueue } from './NotificationQueue';

export class NotificationScheduler {
  private notificationService: NotificationService;
  private notificationQueue: NotificationQueue;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.notificationService = new NotificationService();
    this.notificationQueue = new NotificationQueue();
  }

  private getTenseLabel(tense: string): string {
    const tenseOption = TENSE_OPTIONS.find((option) => option.value === tense);
    return tenseOption ? tenseOption.label : tense;
  }

  start() {
    // Check every 20 seconds for notifications to send
    this.checkInterval = setInterval(async () => {
      await this.checkAndSendNotifications();
    }, 20000); // 20000 ms = 20 seconds

    // Initial check
    this.checkAndSendNotifications();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkAndSendNotifications() {
    try {
      const usersToNotify = await this.notificationService.getUsersToNotify();

      for (const user of usersToNotify) {
        const tense = this.getTenseLabel(user.tense);
        const title = 'İngilizce Pratik Zamanı!';
        const body = `${tense} için pratik yapma vakti geldi. Hemen başlayalım!`;

        // Add notification to queue instead of sending directly
        await this.notificationQueue.addNotification({
          userId: user.id,
          pushToken: user.notification_token,
          title,
          body,
          data: { tense: user.tense },
        });
      }
    } catch (error) {
      console.error('Error in checkAndSendNotifications:', error);
    }
  }
}
