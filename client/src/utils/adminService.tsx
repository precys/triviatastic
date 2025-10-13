import axiosClient from "./axiosClient";

async function getPendingQuestions() {
    const res = await axiosClient.get(`/questions/status?status=pending`);
    return res.data;
}

async function getUsersStats() {
    const res = await axiosClient.get(`/users/stats`);
    return res.data;
}

export default {
    getPendingQuestions,
    getUsersStats,
}