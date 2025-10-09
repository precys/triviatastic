import { useState, ReactNode } from 'react'
import { AuthContext } from './AuthentificationContext';
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    userId: string;
    role: string;
}

function Authentication({children}: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));

    // Login page can use this function to set new token to local storage
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        // setToken(newToken);
        
    // decode JWT to get userId
    const decoded: JWTPayload = jwtDecode(newToken);
    const id = decoded.userId;
    localStorage.setItem("userId", id);

    setToken(newToken);
    setUserId(id);
    }

    // Logout functionality
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken(null);
        setUserId(null);
    }

    // Set the Provider of the context to the values we want to get for the nested components
    return (
        <AuthContext.Provider value= {{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default Authentication;