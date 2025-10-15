import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserInfo from '../components/UserProfile/UserInfo';
import FriendsList from '../components/Friends/FriendsList';
import FriendRequestButton from '../components/FriendRequests/SendFriendRequestButton';

interface ProfileProps {
  currentUserId: string; // logged-in user ID
}

function Profile({ currentUserId }: ProfileProps) {
    const { userId } = useParams<{ userId: string }>();
    
      if (!userId) return <p>User not found</p>;

  return (
    <div>
        <h1>Profile</h1>
        <UserInfo userId={userId} />
        <FriendsList userId={userId} />
        <FriendRequestButton senderId={currentUserId} receiverId={userId} />
    </div>
  );
}

export default Profile;