import { pool } from '../config/database';
import { QuizResult, CreateQuizResultRequest } from '../models/QuizResult';

export class QuizResultService {
  async createQuizResult(
    userId: number,
    data: CreateQuizResultRequest,
  ): Promise<QuizResult> {
    const { tense, total_questions, correct_answers, wrong_answers } = data;

    // Kullanıcının quiz sonucu sayısını kontrol et
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM quiz_results WHERE user_id = $1',
      [userId],
    );
    const quizCount = parseInt(countResult.rows[0].count, 10);
    if (quizCount >= 50) {
      await pool.query('DELETE FROM quiz_results WHERE user_id = $1', [userId]);
    }

    const result = await pool.query(
      `INSERT INTO quiz_results 
       (user_id, tense, total_questions, correct_answers, wrong_answers)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, tense, total_questions, correct_answers, wrong_answers],
    );

    return result.rows[0];
  }

  async updateQuizResult(
    quizId: number,
    userId: number,
    correctAnswers: number,
    wrongAnswers: number,
  ): Promise<QuizResult> {
    const result = await pool.query(
      `UPDATE quiz_results 
       SET correct_answers = $1, 
           wrong_answers = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [correctAnswers, wrongAnswers, quizId, userId],
    );

    if (result.rows.length === 0) {
      throw new Error('Quiz result not found or unauthorized');
    }

    return result.rows[0];
  }

  async getUserQuizResults(userId: number): Promise<QuizResult[]> {
    const result = await pool.query(
      `SELECT * FROM quiz_results 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows;
  }

  async getUserQuizCountForToday(userId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const result = await pool.query(
      `SELECT COUNT(*) FROM quiz_results
       WHERE user_id = $1
       AND created_at >= $2
       AND created_at < $3`,
      [userId, today, tomorrow],
    );
    return parseInt(result.rows[0].count, 10);
  }

  async getNextQuizTime(
    userId: number,
  ): Promise<{ hours: number; minutes: number }> {
    const result = await pool.query(
      'SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId],
    );
    const lastQuiz = result.rows[0];
    if (!lastQuiz) {
      // Hiç quiz yoksa hemen başlayabilir
      return { hours: 0, minutes: 0 };
    }

    const lastQuizTime = new Date(lastQuiz.created_at);

    // Ertesi günün 00:00'ı
    const nextMidnight = new Date(lastQuizTime);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    // Türkiye saati için UTC+3 offset'i uygula
    const now = new Date();
    const turkeyOffset = 3 * 60 * 60 * 1000; // UTC+3 için milisaniye cinsinden offset
    const turkeyNow = new Date(now.getTime() + turkeyOffset);
    const turkeyNextMidnight = new Date(nextMidnight.getTime() + turkeyOffset);

    let diff = turkeyNextMidnight.getTime() - turkeyNow.getTime();

    if (diff < 0) {
      // Zaman geçtiyse hemen başlayabilir
      return { hours: 0, minutes: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + 1;

    return { hours, minutes };
  }
}
