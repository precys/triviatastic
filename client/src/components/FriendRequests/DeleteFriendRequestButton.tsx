import friendsService from "@/utils/friendsService";
import { useState } from "react";

interface DeleteFriendRequestButtonProps {
  userId: string;
  requestId: string;
  sent: boolean;
  onDeleted?: () => void; // callback to check for deletion
}

export default function DeleteFriendRequestButton({ userId, requestId, sent, onDeleted }: DeleteFriendRequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!userId || !requestId) return;

    try {
      setLoading(true);
      const data = await friendsService.deleteFriendReq(userId, requestId, sent);
      console.log("deleted friend req: ", data);
      setLoading(false);

      if (onDeleted) onDeleted(); 
    } catch (err) {
        console.error("Failed to delete friend request:", err);
        setError("Failed to remove friend request.");
        setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-outline-danger btn-sm px-3 py-2 rounded-pill shadow-sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete Friend Request"}
    </button>
  );
}
