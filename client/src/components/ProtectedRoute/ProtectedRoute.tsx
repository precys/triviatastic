import { Navigate } from "react-router-dom";
import AuthentificationHook from "../Context/AuthentificationHook";
import { ReactNode } from "react";

// Simple protected route component that checks for token, if not null then access, if null return to login page on /
function ProtectedRoute({children}: { children: ReactNode }) {
    const { token } = AuthentificationHook();

    if (!token) {
        // Replaces the history with login as well as navigating back to login if authentification is wrong.
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute