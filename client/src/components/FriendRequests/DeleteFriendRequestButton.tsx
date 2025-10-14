import axios from "axios";
import { useState } from "react";

interface DeleteFriendRequestButtonProps {
  userId: string;
  requestId: string;
  onDeleted?: () => void; // callback to update parent state
}

export default function DeleteFriendRequestButton({ userId, requestId, onDeleted }: DeleteFriendRequestButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!userId || !requestId) return;

    setLoading(true);
    try {
      const res = await axios.delete(`http://localhost:3000/users/${userId}/friends-requests/${requestId}`);
      console.log("Delete response", res.data);
      if (onDeleted) onDeleted(); // notify parent to remove request from state
    } catch (err) {
      console.error("Failed to delete friend request:", err);
    } finally {
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
