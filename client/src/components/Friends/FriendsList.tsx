import axios from 'axios';
import { useEffect, useState } from 'react'
import friendsService from '@/utils/friendsService';

// interface FriendsListResponse{
//     message: string;
//     "Friend Count": number;
//     friends: string[];
// }

interface FriendsListProps{
    userId: string;
    onFriendsLoaded?: (friends: string[]) => void;
    addedFriend?: (friend: string) => void;
}

function FriendsList({ userId, onFriendsLoaded, addedFriend  } : FriendsListProps) {
    const [friendsList, setFriendsList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // get friends
    useEffect (() =>{
        if (!userId){
            console.log("userId is not provided in the URL");
            return;
        } 

        try{
            setLoading(true);
            const getFriends = async() => {
                const data = await friendsService.getFriends(userId);
                setFriendsList(data.friends);
                if (onFriendsLoaded) onFriendsLoaded(data.friends);
                setLoading(false);
            };
            getFriends();
        }catch(err){
            console.error("Error fetching friends:", err);
            setError("Failed to load friends.");
            setLoading(false);
        }
    },[userId, onFriendsLoaded])

    // new friends added
    const addFriendToList = (friend: string) => {
        if (!friendsList.includes(friend)) {
            const updated = [...friendsList, friend];
            setFriendsList(updated);
            if (onFriendsLoaded) onFriendsLoaded(updated);
            if (addedFriend) addedFriend(friend); // call parent callback
        }
    };

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