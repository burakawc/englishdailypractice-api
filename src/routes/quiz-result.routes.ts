import { Router } from 'express';
import { QuizResultController } from '../controllers/QuizResultController';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const quizResultController = new QuizResultController();

// Save quiz result
router.post(
  '/',
  verifyToken,
  quizResultController.saveQuizResult.bind(quizResultController),
);

// Get user's quiz results
router.get(
  '/',
  verifyToken,
  quizResultController.getUserQuizResults.bind(quizResultController),
);

export default router;
