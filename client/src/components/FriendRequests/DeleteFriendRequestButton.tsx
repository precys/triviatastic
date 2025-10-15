import friendsService from "@/utils/friendsService";
import { useState } from "react";

interface DeleteFriendRequestButtonProps {
  userId: string;
  requestId: string;
  sent: boolean;
  onDeleted?: () => void; // callback
}

export default function DeleteFriendRequestButton({ userId, requestId, sent, onDeleted }: DeleteFriendRequestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!userId || !requestId) return;

    try {
      setLoading(true);
      const deleteFriendReq = async () => {
        const data = await friendsService.deleteFriendReq(userId, requestId, sent);
        console.log("deleted friend req: ", data);
        setDeleted(true);
        setLoading(false);
      }
      // const res = await axios.delete(`http://localhost:3000/users/${userId}/friends-requests/${requestId}`);
      // console.log("Delete response", res.data);
      deleteFriendReq();
      if (onDeleted) onDeleted(); // notify parent to remove friend request from state
    } catch (err) {
        console.error("Failed to delete friend request:", err);
        setError("Failed to remove friend request.");
        setLoading(false);
    }
  };

  return (
    <button
      className="text-red-500 hover:underline disabled:text-gray-400"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
