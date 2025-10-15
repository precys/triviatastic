import axiosClient from "./axiosClient";

async function getFriends(userId : string){
    const res = await axiosClient.get(`/users/${userId}/friends`);
    return res.data;
}

async function getFriendRequests(userId: string, status: "pending" | "accepted" | "denied", sent: boolean = false){
    const res = await axiosClient.get(`/users/${userId}/friend-requests`, { params: { status, sent } });
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

// uses existing getFriendRequests and getFriends Functions
async function getFriendRequestsStatus(senderId: string, receiverUsername: string){
    // check if already friends
    const friendsData = await getFriends(senderId);
    if (friendsData.friends.includes(receiverUsername)) return "accepted";

    // check pending requests sent by a sender
    const sentPending = await getFriendRequests(senderId, "pending", true)
    if (sentPending.some((req : any) => req.receiverUsername === receiverUsername)) return "pending";
    
    // check denied requests sent by sender
    const sentDenied = await getFriendRequests(senderId, "denied", true);
    if (sentDenied.some((req: any) => req.receiverUsername === receiverUsername)) return "denied";

    // check accepted requests sent by sender
    const sentAccepted = await getFriendRequests(senderId, "accepted", true);
    if (sentAccepted.requests?.some((req: any) => req.receiverUsername === receiverUsername)) {
        return "accepted";
    }
    // check requests received by sender 
    const receivedPending = await getFriendRequests(senderId, "pending", false);
    if (receivedPending.requests?.some((req: any) => req.senderUsername === receiverUsername)) {
        return "pending";
    }

    return "not_sent"; 
}

export default {
    getFriends,
    getFriendRequests,
    sendFriendReq,
    respondToFriendReq,
    deleteFriendReq,
    removeFriend,
    getFriendRequestsStatus
}