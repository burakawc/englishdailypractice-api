import { EnglishTense } from '../types/tense.types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class QuizService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async createQuiz(tense: EnglishTense, questionCount: number = 10) {
    try {
      const prompt = `Generate ${questionCount} English grammar questions about ${tense} tense in JSON format.

Return ONLY a JSON array with this exact structure:
[
  {
    "question_text": "What ___ you doing when I called?",
    "correct_answer": "were",
    "wrong_answers": ["was", "are", "is"]
  }
]

Rules:
- Use ___ for blank spaces
- Include exactly 3 wrong answers
- Return ONLY the JSON array, no other text`;

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean markdown code blocks if present
      let cleanedText = text;
      if (text.includes('```json')) {
        cleanedText = text.split('```json')[1].split('```')[0].trim();
      } else if (text.includes('```')) {
        cleanedText = text.split('```')[1].split('```')[0].trim();
      }

      const parsedResponse = JSON.parse(cleanedText);
      if (!Array.isArray(parsedResponse)) {
        throw new Error('Response is not an array');
      }
      if (parsedResponse.length !== questionCount) {
        throw new Error(
          `Expected ${questionCount} questions but got ${parsedResponse.length}`,
        );
      }
      return parsedResponse;
    } catch (error) {
      throw new Error(
        `Failed to generate quiz: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
