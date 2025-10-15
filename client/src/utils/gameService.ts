import axiosClient from "./axiosClient";

async function startGame(settings: Settings) {
    return await axiosClient.post("/games/start", 
            {
                category: settings.category,
                questionDifficulty: settings.questionDifficulty
            });
}

async function answer(game_id: string | undefined, questionDifficulty: string, correct: boolean) {
    return await axiosClient.post(`/games/${game_id}/answer`,
        {
            questionDifficulty,
            correct
        });
}

async function quitGame(game_id: string | undefined) {
    return await axiosClient.post(`/games/${game_id}/end`, {});
}

async function finishGame(game_id: string | undefined, answeredQuestions: Question[]) {
    return await axiosClient.post(`/games/${game_id}/finish`,
        { 
            answeredQuestions
        });
}

type Question = {
    PK?: string
    SK?: string
    category: string,
    questionId?: string,
    userId?: string,
    type: string,
    difficulty: string,
    question: string,
    correct_answer: string,
    incorrect_answers: Array<string>,
    status?: string,
    createdAt?: Date,
    userAnsweredCorrectly?: boolean
}

type Settings = {
    number: number;
    questionDifficulty: string;
    category: string;
}

export default {
    startGame, answer, finishGame, quitGame
}