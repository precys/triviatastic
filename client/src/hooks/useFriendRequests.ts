import { useState, useEffect } from "react";
import friendsService from "@/utils/friendsService";

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
      console.log("User Id does not exist");
      return;
    }
    const getFriendRequests = async () => {
      const data = await friendsService.getFriendRequests(userId, status, sent);
      console.log("Req DATA: ", data);
      setRequests(data);
      setLoading(false);
    }

    getFriendRequests();
  }, [userId, status, sent]);

  return { requests, loading, error };
}
