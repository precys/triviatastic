// hooks/useFriendRequests.ts
import { useState, useEffect } from "react";
import axios from "axios";

export interface FriendRequest {
  requestId: string;
  userId?: string; // sender
  userFriendId?: string; // receiver
  senderUsername: string;
  receiverUsername: string;
  status: "pending" | "accepted" | "denied";
}

export function useFriendRequests(userId: string, status: "pending" | "accepted" | "denied", sent: boolean = false) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`http://localhost:3000/users/${userId}/friend-requests`, {
        params: { status, sent },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const mappedRequests: FriendRequest[] = data.map((r: any) => ({
          requestId: r.requestId,
          userId: r.userId,
          userFriendId: r.userFriendId,
          senderUsername: r.senderUsername,
          receiverUsername: r.receiverUsername,
          status: r.status,
        }));
        setRequests(mappedRequests);
      })
      .catch((err) => {
        console.error("Error loading friend requests:", err?.response?.data || err.message);
        setError("Failed to load friend requests");
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, [userId, status, sent]);

  return { requests, loading, error };
}
