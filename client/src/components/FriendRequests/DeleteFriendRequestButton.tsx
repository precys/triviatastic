import friendsService from "@/utils/friendsService";
import { useState } from "react";

interface DeleteFriendRequestButtonProps {
  userId: string;
  requestId: string;
  onDeleted?: () => void; // callback
}

export default function DeleteFriendRequestButton({ userId, requestId, onDeleted }: DeleteFriendRequestButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!userId || !requestId) return;

    try {
      setLoading(true);
      const deleteFriendReq = async () => {
        const data = await friendsService.deleteFriendReq(userId, requestId);
        console.log("deleted friend req: ", data);
        setLoading(false);
      }
      // const res = await axios.delete(`http://localhost:3000/users/${userId}/friends-requests/${requestId}`);
      // console.log("Delete response", res.data);
      deleteFriendReq();
      if (onDeleted) onDeleted(); // notify parent to remove request from state
    } catch (err) {
      console.error("Failed to delete friend request:", err);
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
