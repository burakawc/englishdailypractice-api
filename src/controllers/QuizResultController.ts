import { Request, Response } from 'express';
import { QuizResultService } from '../services/QuizResultService';

export class QuizResultController {
  private quizResultService: QuizResultService;

  constructor() {
    this.quizResultService = new QuizResultService();
  }

  async saveQuizResult(req: Request, res: Response) {
    try {
      const { quizId, correctAnswers, wrongAnswers } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      if (
        !quizId ||
        typeof correctAnswers !== 'number' ||
        typeof wrongAnswers !== 'number'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request data',
        });
      }

      const updatedResult = await this.quizResultService.updateQuizResult(
        quizId,
        userId,
        correctAnswers,
        wrongAnswers,
      );

      res.json({
        success: true,
        data: updatedResult,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getUserQuizResults(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const results = await this.quizResultService.getUserQuizResults(userId);
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
