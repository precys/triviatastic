import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { User, useUser } from "../../hooks/useUser";
import FriendRequestButton from '../FriendRequests/SendFriendRequestButton';

interface UserListProps {
  currentUserId: string;
  users: User[];
}

export default function UsersList({ currentUserId, users } : UserListProps) {

  return (
     <div className="p-3 border rounded bg-white shadow mt-3">
      <h3 className="text-lg font-semibold mb-2">Users</h3>
      <select className="border p-2 rounded w-full">
        <option value="">-- Select a User --</option>
        {users
          .filter((u) => u.userId !== currentUserId)
          .map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.username}
            </option>
          ))}
      </select>
    </div>
  )
}

//export default UsersList