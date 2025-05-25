import { EnglishTense } from '../types/tense.types';

export interface QuizResult {
  id: number;
  user_id: number;
  tense: EnglishTense;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateQuizResultRequest {
  tense: EnglishTense;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
}
