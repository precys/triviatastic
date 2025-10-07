import { useState, useEffect, ReactNode } from 'react'
import { AuthContext } from './AuthentificationContext';

function Authentication({children}: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    // After login token should be within local storage, save it for state
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken)
        }
    }, [])

    // Login page can use this function to set new token to local storage
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    // Logout functionality
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    // Set the Provider of the context to the values we want to get for the nested components
    return (
        <AuthContext.Provider value= {{ token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default Authentication;