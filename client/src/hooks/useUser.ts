import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
    userId: string;
    username: string;
}


export function useUser( userId: string ) {
    const [user, setUser]  = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!userId){
            console.log("userId does not exist");
            return;
        } 

        axios.get(`http://localhost:3000/users/${userId}`)
            .then((response) => {
                console.log("Response:", response.data);
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error Fetching User", error);
                setError("User failed to load");
                setLoading(false);
            });
    }, [userId])

  return {user, loading, error};
  
}
