import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface UserInfo{
    // userId: string;
    username: string;
    //password: string; //hide with passwordhash?
}

function Profile() {
    const { userId } = useParams<{ userId: string }>();
    const[ user, setUser ] = useState<UserInfo | null> (null);
    //const[ user, setUser ] = useState<any>(null);

    useEffect(() => {
        if (!userId){
            console.log("userId is not provided in the URL");
            return;
        } 

        console.log("userId: ", userId);

        axios.get(`http://localhost:3000/users/${userId}`)
        .then(response => {
            console.log("Response:", response.data);
            setUser(response.data);
        })
        .catch(error => {
            console.log('Error fetching user:', error);
        });
    },[userId]);
    
     if (!user) return <p>Loading...</p>;

  return (
    <div>
        <h1>Profile</h1>
        <h2>{user.username}</h2>
    </div>
  );
}

export default Profile;