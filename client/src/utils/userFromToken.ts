import { jwtDecode } from "jwt-decode"; // note: use curly braces per jwt-decode v3+ typescript
import AuthentificationHook from "@/components/Context/AuthentificationHook";

interface DecodedToken {
  userId?: string;
  username?: string;
  iat?: number;
  exp?: number;
}

export function userFromToken() {
  const { token } = AuthentificationHook();
  if (!token) return { userId: null, username: null };

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      userId: decoded.userId ?? null,
      username: decoded.username ?? null,
    };
  } catch (err) {
    console.error("failed to decode jwt:", err);
    return { userId: null, username: null };
  }
}
