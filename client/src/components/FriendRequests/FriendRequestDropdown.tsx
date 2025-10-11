import React from 'react'
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser, User } from "@/hooks/useUser";
import FriendRequestButton from "@/components/FriendRequests/SendFriendRequestButton";
import UsersList from '../Friends/UsersList';
// import { User } from "/@hooks/useAllUsers";

interface FriendRequestProps {
  senderId: string;
  users: User[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
}

export default function FriendRequestDropdown({ senderId, users, selectedUserId, setSelectedUserId, }: FriendRequestProps) {
    const { user: selectedUser } = useUser(selectedUserId || "");

    // Sort users alphabetically by username
    const sortedUsers = users
      .filter((u) => u.userId !== senderId)
      .sort((a, b) => a.username.localeCompare(b.username));

  return (
     <div className="p-3 border rounded mb-3">
      <label htmlFor="friendSelect" className="block mb-2 font-semibold">
        Select a User to Send Friend Request
      </label>
      <select
        id="friendSelect"
        className="border p-2 rounded w-full"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">-- Select a User --</option>
        {sortedUsers.map((u) => (
          <option key={u.userId} value={u.userId}>
            {u.username}
          </option>
        ))}
      </select>

      {selectedUser && (
        <div className="mt-2 flex justify-between items-center p-2 border rounded bg-gray-50">
          <span>{selectedUser.username}</span>
          <FriendRequestButton senderId={senderId} receiverId={selectedUser.userId} receiverUsername={selectedUser.username}/>
        </div>
      )}
    </div>
  )
}

// export default FriendRequestSearch