import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";

interface FriendsListResponse{
    message: string;
    "Friend Count": number;
    friends: string[];
}

interface FriendsListProps{
    userId: string;
}


function FriendsList({ userId } : FriendsListProps) {
    const [friendsList, setFriendsList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    useEffect (() =>{
        if (!userId){
            console.log("userId is not provided in the URL");
            return;
        } 
        
        axios.get<FriendsListResponse>(`http://localhost:3000/users/${userId}/friends`)
        .then( (response) => {
            console.log("Response:", response.data);
            setFriendsList(response.data.friends);
            setMessage(response.data.message);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching friendslist", error);
            setError("Failed to load friends list");
            setLoading(false);
        });
    },[userId])

    if (loading) return <p>Loading friends...</p>;
    if (error) return <p>{error}</p>;
    

  return (
    <div>
        <h3>Friends List ({friendsList.length} {friendsList.length === 1 ? "friend" : "friends"}) </h3>
        {friendsList.length === 0 ?(
            <p>{message}</p>
        ) : (
            <ul>
                {friendsList.map((friend, index) => (
                    <li key={index}>{friend}</li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default FriendsList