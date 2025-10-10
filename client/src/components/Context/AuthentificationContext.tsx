import { createContext } from "react";

// Setting up an interface to create a Token type for context
export interface AuthContextType{
    token: string | null;
    userRole: string | null;
    url: string;
    setRole: (userRole: string ) => void;
    login: (token: string) => void;
    logout: () => void;
}

// Initialize AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined)