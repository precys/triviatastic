import {useState } from "react";
import friendsService from "@/utils/friendsService";

interface RemoveFriendButtonProps {
    username: string; // current logged-in userId
    friendUsername: string; // friend to remove
    onRemoved?: () => void; // callback checking if friend was removed
}

export default function RemoveFriendButton({ username, friendUsername, onRemoved }: RemoveFriendButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    setError(null);
    try {
      const removeFriend = async () => {
        const data = await friendsService.removeFriend(username, friendUsername);
        console.log(`${friendUsername} removed: `, data);
        setLoading(false);
        setRemoved(true);
      }
      removeFriend();
      if (onRemoved) onRemoved();
    } catch (err) {
      console.error("Error removing friend:", err);
      setError("Failed to remove friend.");
    } finally {
      setLoading(false);
    }
  };

  if (removed) {
    return (
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-medium">
        Removed
      </span>
    );
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="btn btn-danger btn-sm rounded-pill px-3 py-2 shadow-sm"
    >
      {loading ? "Removing..." : "Remove Friend"}
    </button>
  );
}
