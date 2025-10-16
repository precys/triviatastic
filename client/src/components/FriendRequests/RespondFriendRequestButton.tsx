import { useState } from 'react'
import axiosClient from '@/utils/axiosClient';
import friendsService from '@/utils/friendsService';

interface RespondFriendRequestButtonProps {
  senderId: string;
  senderUsername: string;
  receiverId: string;
  requestId: string;
  onResponse?: (status: 'accepted' | 'denied', username?: string) => void; // callback if request was responded to
  onFriendAdded?: (username: string) => void; // callback if a new friend was added from a request
}

export default function RespondFriendRequestButton({ senderId, senderUsername, receiverId, requestId, onResponse, onFriendAdded } : RespondFriendRequestButtonProps) {
    const [loading, setLoading] = useState(false);
    const [responseStatus, setResponseStatus] = useState<"accepted" | "denied" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResponse = async (status: 'accepted' | 'denied') => {
        setLoading(true);
        setError(null);

        try{
            const res = await axiosClient.put(`/users/${receiverId}/friend-requests/${requestId}`, { status });
            console.log("Response from backend:", res.data);
            const respondToReq = async () => {
                const data = await friendsService.respondToFriendReq(receiverId, requestId, status);
                console.log("friend req response data: ", data);

                if (status === 'accepted' && senderUsername) {
                    if (onFriendAdded) onFriendAdded(senderUsername);
                }

                setResponseStatus(status);
                setLoading(false);
            }
            respondToReq();

            if(onResponse) onResponse(status, senderUsername);

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
        <div className="d-flex gap-3 align-items-center">
            <button
                className="btn btn-success btn-sm px-3 py-2 rounded-pill shadow-sm border-0"
                disabled={loading}
                onClick={() => handleResponse("accepted")}
            >
                {loading ? "..." : "Accept"}
            </button>

            <button
                className="btn btn-danger btn-sm px-3 py-2 rounded-pill shadow-sm border-0"
                disabled={loading}
                onClick={() => handleResponse("denied")}
            >
                {loading ? "..." : "Deny"}
            </button>

            {error && <p className="text-danger small mt-1 mb-0">{error}</p>}
        </div>
  );
}

