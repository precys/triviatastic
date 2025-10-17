import { useState, useEffect } from "react";
import axiosClient from "@/utils/axiosClient";

interface LikeButtonProps {
  postId: string;
  userId: string;
  // COMMENT VARIABLE BELOW
  // likes: number,
  // liked: boolean,
  // onToggle: () => void,
}

function LikeButton({ postId, userId }: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    axiosClient
      .get(`/posts/${postId}/likes/${userId}`)
      .then((res) => {
        setLikesCount(res.data.likesCount);
        setLiked(res.data.liked);
      })
      .catch(console.error);
  }, [postId, userId]);

  const handleLikeClick = async () => {
    try {
      const res = await axiosClient.post(
        `/posts/${postId}/like-toggle`,
        { userId }
      );
      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleLikeClick}>
      {liked ? "Unlike" : "Like"} ({likesCount})
    </button>
  );
}

export default LikeButton;
