import React, { useState, useEffect } from "react";
import axios from "axios";

interface LikeButtonProps {
  postId: string;
  userId: string;
}

function LikeButton({ postId, userId }: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/posts/${postId}/likes/${userId}`)
      .then((res) => {
        setLikesCount(res.data.likesCount);
        setLiked(res.data.liked);
      })
      .catch(console.error);
  }, [postId, userId]);

  const handleLikeClick = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/posts/${postId}/like-toggle`,
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
