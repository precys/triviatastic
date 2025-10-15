import axiosClient from "./axiosClient";
import { QuestionInterface } from "@/types/question";

async function createQuestion(question: QuestionInterface){
    const res = await axiosClient.post(`/questions/`, question)
    return res.status;
}

async function getUserQuestions(userId: string){
    const res = await axiosClient.get(`/questions/${userId}`)
    return res.data
}

async function getQuestionsForGame(settings: Settings) {
    return await axiosClient.get(`/questions/category?category=${settings.category}&n=${settings.number}&difficulty=${settings.questionDifficulty}&type=any`);
}

type Settings = {
    number: number;
    questionDifficulty: string;
    category: string;
}

export default {
    createQuestion,
    getUserQuestions,
    getQuestionsForGame
}