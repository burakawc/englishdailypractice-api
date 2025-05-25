import { Request, Response } from 'express';
import { QuizService } from '../services/QuizService';
import { QuizResultService } from '../services/QuizResultService';
import { EnglishTense } from '../types/tense.types';

export class QuizController {
  private quizService: QuizService;
  private quizResultService: QuizResultService;

  constructor() {
    this.quizService = new QuizService();
    this.quizResultService = new QuizResultService();
  }

  async createQuiz(req: Request, res: Response) {
    try {
      const { tense, questionCount } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Günlük quiz limiti kontrolü
      const todayQuizCount =
        await this.quizResultService.getUserQuizCountForToday(userId);
      if (todayQuizCount >= 3) {
        const { hours, minutes } = await this.quizResultService.getNextQuizTime(
          userId,
        );
        let timeMsg = '';
        if (hours > 0 || minutes > 0) {
          timeMsg = `Tekrar quiz başlatmak için ${
            hours > 0 ? hours + ' saat ' : ''
          }${minutes > 0 ? minutes + ' dakika ' : ''}bekleyiniz.`;
        } else {
          timeMsg = 'Quiz hakkınız sıfırlandı, tekrar başlayabilirsiniz.';
        }
        return res.status(400).json({
          success: false,
          message: `Günde en fazla 3 quiz başlatılabilir. ${timeMsg}`,
        });
      }

      if (!Object.values(EnglishTense).includes(tense)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid tense value',
        });
      }

      const questions = await this.quizService.createQuiz(tense, questionCount);

      // Create initial quiz result with zero scores
      const quizResult = await this.quizResultService.createQuizResult(userId, {
        tense,
        total_questions: questionCount,
        correct_answers: 0,
        wrong_answers: 0,
      });

      res.json({
        success: true,
        data: {
          questions,
          quizId: quizResult.id,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
