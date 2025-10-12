import axios from 'axios';
import React, { useEffect, useState } from 'react'


interface friendReqButtonProps{
    senderId: string; //sender
    receiverId: string; //receiver
}

function FriendRequestButton( { senderId, receiverId }: friendReqButtonProps ) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    

    const sendRequest = () => {
        setLoading(true);
        axios.post(`http://localhost:3000/users/${senderId}/friend-requests`, { friendId: receiverId })
            .then((response) => {
                console.log("Response:", response.data);
                setMessage(response.data.message);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching friendslist", error);
                setError("Failed to send get friend request");
                setLoading(false);
            });
    }
       
    // if (loading) return <p>Loading friends...</p>;
    // if (error) return <p>{error}</p>;

  return (
    <div>
        < button onClick={sendRequest} disabled={loading}> 
            {loading ? "Sending..." : "Send Friend Request"}
        </button>
        {message && <span> - {message}</span>}
        {error && <span> - {error}</span>}
    </div>
  )
}

export default FriendRequestButton