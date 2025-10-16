import { useEffect, useState } from "react";
import { FriendRequest } from "@/hooks/useFriendRequests";
import RespondFriendRequestButton from "./RespondFriendRequestButton";
import DeleteFriendRequestButton from "./DeleteFriendRequestButton";

interface FriendRequestsListProps {
    currentUserId: string;
    sent: boolean; //for toggling between received/sent requests
    requests: FriendRequest[];
    loading: boolean;
    error?: string;
    activeStatus: "pending" | "accepted" | "denied";
    onResponse?: (requestId: string, status: "accepted" | "denied", username?: string) => void; //callback to check if a request was responded to
    onFriendAdded?: (username: string) => void; //callback to refresh FriendsList
}

export default function FriendRequestsList({ currentUserId, sent, requests, loading, error="", activeStatus, onResponse, onFriendAdded, }: FriendRequestsListProps) {
  const [localRequests, setLocalRequests] = useState<FriendRequest[]>(requests);
  const [deleteError, setDeleteError] = useState<string | null>(null);
    
  useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const handleResponse = (requestId: string, status: "accepted" | "denied", username?: string) => {
      setLocalRequests((prev) =>
          prev.map((r) => (r.requestId === requestId ? { ...r, status } : r))
      );
      if (onResponse) onResponse(requestId, status, username);
      if (status === "accepted" && onFriendAdded && username) onFriendAdded(username); // refreshes friends list
  };

    // Callback when a friend request is successfully deleted
  const handleDeleteCallback = (requestId: string) => {
    setLocalRequests((prev) => prev.filter((r) => r.requestId !== requestId));
  };
    
  const filteredRequests = localRequests.filter(r => r.status === activeStatus);
  console.log("Filtered Requests:", filteredRequests);

  if (loading) return <p className="text-gray-500">Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
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
              {sent ? req.receiverUsername || "Unknown" : `From: ${req.senderUsername || "Unknown"}`}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex gap-2">
              {!sent && req.status === "pending" && (
                <RespondFriendRequestButton
                  senderId={req.userId || ""}
                  senderUsername={req.senderUsername || ""}
                  receiverId={currentUserId}
                  requestId={req.requestId}
                  onResponse={(status, username) => handleResponse(req.requestId, status, username)}
                  onFriendAdded={onFriendAdded}
                />
              )}
            </div>

            <DeleteFriendRequestButton
              userId={currentUserId}
              requestId={req.requestId}
              sent={sent}
              onDeleted={() => handleDeleteCallback(req.requestId)}
            />
          </div>
        </li>
      ))}

      {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
    </ul>
  );
}
