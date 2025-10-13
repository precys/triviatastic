import axiosClient from "./axiosClient";

async function getPendingQuestions() {
    const res = await axiosClient.get(`/questions/status?status=pending`);
    return res.data;
}

async function getUsersStats() {
    const res = await axiosClient.get(`/users/stats`);
    return res.data;
}

async function updateQuestionStatus(questionId: string, status: string){
    const res = await axiosClient.patch(`/questions/${questionId}?status=${status}`);
    return res.data;
}

async function deleteUser(userId: string){
    const res = await axiosClient.delete(`/users/${userId}`);
    return res.data;
}

export default {
    getPendingQuestions,
    getUsersStats,
    updateQuestionStatus,
    deleteUser
}