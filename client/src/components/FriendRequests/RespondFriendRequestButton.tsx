import React, { useState } from 'react'
import axiosClient from '@/utils/axiosClient';
import friendsService from '@/utils/friendsService';

interface RespondFriendRequestButtonProps {
  senderId: string;
  senderUsername: string;
  receiverId: string;
  requestId: string;
  onResponse?: (status: 'accepted' | 'denied', username?: string) => void; //callback to parent FriendRequestsList if request was responded to
}

export default function RespondFriendRequestButton({ senderId, senderUsername, receiverId, requestId, onResponse } : RespondFriendRequestButtonProps) {
    const [loading, setLoading] = useState(false);
    const [responseStatus, setResponseStatus] = useState<"accepted" | "denied" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResponse = async (status: 'accepted' | 'denied') => {
        setLoading(true);
        setError(null);

        try{
            const res = await axiosClient.put(`/users/${receiverId}/friend-requests/${requestId}`, { status });
            console.log("Response from backend:", res.data);
            // const res = await axios.put(`http://localhost:3000/users/${receiverId}/friend-requests/${requestId}`, { status });
            // console.log("Response from backend:", res.data);
            const respondToReq = async () => {
                const data = await friendsService.respondToFriendReq(receiverId, requestId, status);
                console.log("friend req response data: ", data);

                // Update Button States
                setResponseStatus(status);
                setLoading(false);
            }
            respondToReq();

            // send state to parent
            if(onResponse) onResponse(status, status === "accepted" ? senderUsername : undefined);
            // if(onResponse) onResponse(status);

        }catch(error){
            console.error("Error responding to friend request: ", error)
            setError("Failed to update request.");
            setLoading(false);
        } 
    }

    // show status if not pending
    if (responseStatus) {
        return (
        <span
            className={`px-3 py-1 rounded text-sm font-semibold ${
            responseStatus === "accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
            {responseStatus === "accepted" ? "Accepted" : "Denied"}
        </span>
        );
    }
  
    return (
        <div className="space-x-2">
            <button
                className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
                onClick={() => handleResponse("accepted")}
            >
                {loading ? "..." : "Accept"}
            </button>
            <button
                className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                disabled={loading}
                onClick={() => handleResponse("denied")}
            >
                {loading ? "..." : "Deny"}
            </button>

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
  );
}

