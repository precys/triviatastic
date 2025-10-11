import React, { useState } from 'react'
import axios from 'axios';

interface RespondFriendRequestButtonProps {
  senderId: string;
  receiverId: string;
  requestId: string;
  onResponse?: (status: 'accepted' | 'denied') => void;
}

export default function RespondFriendRequestButton({ senderId, receiverId, requestId, onResponse } : RespondFriendRequestButtonProps) {
    const [loading, setLoading] = useState(false);

    const respond = async (status: 'accepted' | 'denied') => {
        setLoading(true);
        try{
            await axios.put(`http://localhost:3000/users/${receiverId}/friend-requests/${requestId}`, {status,});
            if(onResponse) onResponse(status);
        }catch(error){
            console.error("Error responding to friend request: ", error)
        } finally {
            setLoading(false);
        }
    }
  
    return (
        <div className="flex gap-2">
            <button
                onClick={() => respond("accepted")}
                disabled={loading}
                className="px-2 py-1 bg-green-500 text-white rounded"
            >
                Accept
            </button>
            <button
                onClick={() => respond("denied")}
                disabled={loading}
                className="px-2 py-1 bg-red-500 text-white rounded"
            >
                Deny
            </button>
        </div>
  );
}

