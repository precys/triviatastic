import React, { useEffect, useState } from 'react'
import { User } from "../../hooks/useUser";
import axios from 'axios';
import FriendRequestButton from './FriendRequestButton';


interface userListProps {
    userId: string; 
}

function UserList({ userId }: userListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<User[]>("http://localhost:3000/users")
            .then ((response) => {
                console.log("Response:" + response.data)
                setUsers(response.data)
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch all users");
                setLoading(false);
            })
    }, [userId]);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;

  return (
    <ul>
        {users.map(user => (
            <li key={user.userId}>
                {user.username} <FriendRequestButton senderId={userId} receiverId={user.userId} />
            </li>
        ))}
    </ul>
  )
}

export default UserList