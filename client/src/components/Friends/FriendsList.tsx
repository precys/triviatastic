import axios from 'axios';
import { useEffect, useState } from 'react'
import friendsService from '@/utils/friendsService';

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
    // const user = userFromToken();
    // const userId = user.userId || "";

    useEffect (() =>{
        if (!userId){
            console.log("userId is not provided in the URL");
            return;
        } 
        const getFriends = async() => {
            const data = await friendsService.getFriends(userId);
            setFriendsList(data.friends);
            setLoading(false);
        };
        
    //     axios.get<{ friends: string[]; message?: string }>(`http://localhost:3000/users/${userId}/friends`)
    //         .then((res) => {
    //             setFriendsList(res.data.friends || []);
    //             if (onFriendsLoaded) onFriendsLoaded(res.data.friends || []);
    //                 setLoading(false);
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //                 setError("Failed to load friends list");
    //                 setLoading(false);
    //             });
        getFriends();
    },[userId])

    console.log(friendsList);
    if (loading) return <p>Loading friends...</p>;
    if (error) return <p>{error}</p>;
    

  return (
      <div>
        <h3>
            Friends ({friendsList.length} {friendsList.length === 1 ? "friend" : "friends"})
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