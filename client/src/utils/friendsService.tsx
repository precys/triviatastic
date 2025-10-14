import axiosClient from "./axiosClient";

async function getFriends(userId : string){
    const res = await axiosClient.get(`/users/${userId}/friends`);
    return res.data;
}

async function getFriendRequests(userId: string, status: "pending" | "accepted" | "denied", sent: boolean = false){
    const res = await axiosClient.get(`http://localhost:3000/users/${userId}/friend-requests`, {params: { status, sent },});
    return res.data;
}

export default {
    getFriends,
    getFriendRequests
}