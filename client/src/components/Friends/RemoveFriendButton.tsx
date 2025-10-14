import React, { useState } from "react";
import axios from "axios";

interface RemoveFriendButtonProps {
    username: string; // current logged-in userId
    friendUsername: string; // friend to remove
    onRemoved?: () => void; // optional callback
}

export default function RemoveFriendButton({ username, friendUsername, onRemoved }: RemoveFriendButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(
        `http://localhost:3000/users/${username}/friends/${friendUsername}`
      );
      setRemoved(true);
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
      className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove Friend"}
    </button>
  );
}
