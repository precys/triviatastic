import { useEffect, useState } from 'react'
import friendsService from '@/utils/friendsService';

interface FriendsListProps{
    userId: string;
    onFriendsLoaded?: (friends: string[]) => void;
    addedFriend?: string | null;
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

    useEffect(() => {
        if (addedFriend && !friendsList.includes(addedFriend)){
            const updated = [...friendsList, addedFriend];
            setFriendsList(updated);
            if (onFriendsLoaded) onFriendsLoaded(updated);
        }
    }, [addedFriend]);

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