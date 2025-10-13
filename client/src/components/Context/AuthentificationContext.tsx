import { createContext } from "react";

// setup user for user information to use accross site
export interface User {
    userId: string,
    username: string,
}

// Setting up an interface to create a Token type for context
export interface AuthContextType{
    token: string | null;
    userRole: string | null;
    setRole: (userRole: string ) => void;
    login: (token: string) => void;
    logout: () => void;
    users: User[];
    setUsers: (users: User[]) => void;
}

// Initialize AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined)