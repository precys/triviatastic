import axiosClient from "./axiosClient";
import { QuestionInterface } from "@/types/question";

async function createQuestion(question: QuestionInterface){
    const res = await axiosClient.post(`/questions/`, question)
    return res.status;
}

export default {
    createQuestion,
}