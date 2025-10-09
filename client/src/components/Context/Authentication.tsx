import { useState, ReactNode } from 'react'
import { AuthContext } from './AuthentificationContext';

function Authentication({children}: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

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
        setToken(null);
    }

    // Set the Provider of the context to the values we want to get for the nested components
    return (
        <AuthContext.Provider value = {{ token, login, logout, userRole, setRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export default Authentication;