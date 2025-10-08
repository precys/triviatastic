import { useContext } from 'react'
import { AuthContext, AuthContextType } from './AuthentificationContext';

// Authentification hook initializes so that useContext can just be called by the hook rather initializing context over and over.
// Basically takes the values from Authentification.tsx and makes those values have something
// values: token, logout, login
const AuthentificationHook = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("AuthentificationHook must be used inside the provider.");
    }
    return context;
}

export default AuthentificationHook