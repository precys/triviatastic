import axiosClient from "./axiosClient";

async function getLeaderboard(category: string) {
    const res = await axiosClient.get(`/users/leaderboard?category=${category}`);
    return res.data
}

export default {
    getLeaderboard
}