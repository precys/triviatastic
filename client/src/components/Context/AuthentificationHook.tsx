import { useContext } from 'react'
import { AuthContext, AuthContextType } from './AuthentificationContext';

const AuthentificationHook = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("AuthentificationHook must be used inside the provider.");
    }
    return context;
}

export default AuthentificationHook