import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import RemoveFriendButton from './RemoveFriendButton';

interface FriendsListResponse{
    message: string;
    "Friend Count": number;
    friends: string[];
}

interface FriendsListProps{
    userId: string;
    onFriendsLoaded?: (friends: string[]) => void;
}

function FriendsList({ userId, onFriendsLoaded  } : FriendsListProps) {
    const [friendsList, setFriendsList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect (() =>{
        if (!userId){
            console.log("userId is not provided in the URL");
            return;
        } 
        
        axios.get<{ friends: string[]; message?: string }>(`http://localhost:3000/users/${userId}/friends`)
            .then((res) => {
                setFriendsList(res.data.friends || []);
                if (onFriendsLoaded) onFriendsLoaded(res.data.friends || []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to load friends list");
                    setLoading(false);
                });
    },[userId])

    if (loading) return <p>Loading friends...</p>;
    if (error) return <p>{error}</p>;
    

  return (
      <div>
        <h3>
            Friends List ({friendsList.length} {friendsList.length === 1 ? "friend" : "friends"})
        </h3>
        {friendsList.length === 0 ? (
            <p>No friends yet.</p>
        ) : (
            <ul>
            {friendsList.map((friend) => (
                <li key={friend}>{friend}</li>
            ))}
            </ul>
        )}
    </div>
  )
}

export default FriendsList