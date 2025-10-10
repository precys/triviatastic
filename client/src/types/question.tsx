export interface Question {
  questionId: string;
  question: string;
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: [];
  username: string;
}
