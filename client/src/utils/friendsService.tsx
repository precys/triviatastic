import axiosClient from "./axiosClient";

async function getFriends(userId : string){
    const res = await axiosClient.get(`/users/${userId}/friends`);
    return res.data;
}

async function getFriendRequests(userId: string, status: "pending" | "accepted" | "denied", sent: boolean = false){
    const res = await axiosClient.get(`/users/${userId}/friend-requests`, {params: { status, sent },});
    return res.data;
}

async function sendFriendReq (senderId: string, receiverUsername: string){
    const res = await axiosClient.post(`/users/${senderId}/friend-requests`, { friendUsername: receiverUsername});
    return res.data;
}

async function respondToFriendReq (receiverId: string, requestId: string, status: 'accepted' | 'denied'){
    const res = await axiosClient.put(`/users/${receiverId}/friend-requests/${requestId}`, { status });
    return res.data;
}

async function deleteFriendReq(userId: string, requestId: string, sent: boolean = false){
    const res = await axiosClient.delete(`/users/${userId}/friend-requests/${requestId}`, { params: { sent }});
    return res.data;
}

async function removeFriend(username: string, friendUsername: string){
    const res = await axiosClient.delete(`/users/${username}/friends/${friendUsername}`);
    return res.data;
}


export default {
    getFriends,
    getFriendRequests,
    sendFriendReq,
    respondToFriendReq,
    deleteFriendReq,
    removeFriend
}