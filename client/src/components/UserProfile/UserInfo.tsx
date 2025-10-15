import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../../hooks/useUser';

interface UserInfoProps {
  userId: string;
}


function UserInfo({ userId }: UserInfoProps) {
    const {user, loading, error} = useUser(userId);

    if (loading) return <p>Loading user...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>User Not Found.</p>;

  return (
    <div>
        <h2>{user.username}</h2>
    </div>
  )
}

export default UserInfo