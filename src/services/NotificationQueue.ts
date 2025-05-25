import Queue from 'bull';
import { NotificationService } from './NotificationService';

interface NotificationJob {
  userId: number;
  pushToken: string;
  title: string;
  body: string;
  data: any;
}

export class NotificationQueue {
  private queue: Queue.Queue;
  private notificationService: NotificationService;

  constructor() {
    this.queue = new Queue('notifications', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.notificationService = new NotificationService();

    // Process jobs
    this.queue.process(async (job) => {
      const { userId, pushToken, title, body, data } =
        job.data as NotificationJob;

      try {
        // Send notification
        const success = await this.notificationService.sendPushNotification(
          pushToken,
          title,
          body,
          data,
        );

        if (success) {
          // Mark as clicked only if notification was sent successfully
          await this.notificationService.markNotificationAsClicked(userId);
        }

        return { success };
      } catch (error) {
        console.error('Error processing notification job:', error);
        throw error;
      }
    });

    // Handle failed jobs
    this.queue.on('failed', (job, error) => {
      console.error(`Job ${job.id} failed:`, error);
    });
  }

  async addNotification(job: NotificationJob) {
    return this.queue.add(job, {
      attempts: 3, // Retry 3 times if fails
      backoff: {
        type: 'exponential',
        delay: 1000, // Start with 1 second delay
      },
    });
  }

  async getQueueStatus() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
    };
  }
}
