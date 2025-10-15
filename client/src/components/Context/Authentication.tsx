import { useState, useEffect, ReactNode } from 'react'
import { AuthContext, User } from './AuthentificationContext';

function Authentication({children}: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([])

    // Saves token and role information so that you don't have to relogin on page refresh as long as token is not null.
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('userRole');
        if (savedToken) setToken(savedToken);
        if (savedRole) setUserRole(savedRole);
    }, []);

    // Login page can use this function to set new token to local storage
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    const setRole = (role: string) => {
        localStorage.setItem("userRole", role);
        setUserRole(role)
    }

    // Logout functionality
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken(null);
    }

    // Set the Provider of the context to the values we want to get for the nested components
    return (
        <AuthContext.Provider value={{ token, login, logout, userRole, setRole, users, setUsers}}>
            {children}
        </AuthContext.Provider>
    )
}

export default Authentication;