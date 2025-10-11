import { useEffect, useState } from "react";
import { useFriendRequests, FriendRequest } from "@/hooks/useFriendRequests";
import SendFriendRequestButton from "./SendFriendRequestButton";
import RespondFriendRequestButton from "./RespondFriendRequestButton";

interface FriendRequestsListProps {
    currentUserId: string;
    sent: boolean; // prop to toggle received/sent requests
    requests: FriendRequest[];
    loading: boolean;
    error?: string;
    activeStatus: "pending" | "accepted" | "denied";
    onResponse?: (requestId: string, status: "accepted" | "denied") => void;
    onFriendAdded?: () => void; //callback to refresh FriendsList
}

export default function FriendRequestsList({ currentUserId, sent, requests, loading, error="", activeStatus, onResponse, onFriendAdded, }: FriendRequestsListProps) {
    const [localRequests, setLocalRequests] = useState<FriendRequest[]>(requests);
    
    useEffect(() => {
      setLocalRequests(requests);
    }, [requests]);

    const handleResponse = (requestId: string, status: "accepted" | "denied") => {
        setLocalRequests((prev) =>
            prev.map((r) => (r.requestId === requestId ? { ...r, status } : r))
        );
        if (onResponse) onResponse(requestId, status);
        if (status === "accepted" && onFriendAdded) onFriendAdded(); // refresh friends list
    };

    if (loading) return <p className="text-gray-500">Loading requests...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    
     // Filter requests by status
    const filteredRequests = localRequests.filter(r => r.status === activeStatus);
    console.log("Filtered Requests:", filteredRequests);

    if (filteredRequests.length === 0)
        return (
            <p className="text-gray-500 text-sm italic">
            No {activeStatus} {sent ? "sent" : "received"} requests.
            </p>
        );   

  return (
    <ul className="divide-y divide-gray-200">
      {filteredRequests.map((req) => (
        <li key={req.requestId} className="py-2 flex justify-between items-center">
          <div>
            <span className="font-medium">
              {sent
                ? `${req.receiverUsername || "Unknown"}`
                : `From: ${req.senderUsername || "Unknown"}`}
            </span>
          </div>

          {/* Respond buttons only appear for received pending requests */}
          {!sent && req.status === "pending" && (
            <RespondFriendRequestButton
              senderId={req.userId || ""}
              receiverId={currentUserId}
              requestId={req.requestId}
              onResponse={(status) => handleResponse(req.requestId, status)}
            />
          )}
        </li>
      ))}
    </ul>

  );
}
