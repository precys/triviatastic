import axiosClient from "./axiosClient";

async function getFriends(userId : string){
    const res = await axiosClient.get(`/users/${userId}/friends`);
    return res.data;
}

async function getFriendRequests(userId: string, status: "pending" | "accepted" | "denied", sent: boolean = false){
    const res = await axiosClient.get(`http://localhost:3000/users/${userId}/friend-requests`, {params: { status, sent },});
    return res.data;
}

async function sendFriendReq (senderId: string, receiverUsername: string){
    const res = await axiosClient.post(`http://localhost:3000/users/${senderId}/friend-requests`, { friendUsername: receiverUsername});
    return res.data;
}

export default {
    getFriends,
    getFriendRequests,
    sendFriendReq
}