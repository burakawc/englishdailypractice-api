import { Router } from 'express';
import { QuizController } from '../controllers/QuizController';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const quizController = new QuizController();

// Create a new quiz with random questions for a specific tense
router.post(
  '/create',
  verifyToken,
  quizController.createQuiz.bind(quizController),
);

export default router;
