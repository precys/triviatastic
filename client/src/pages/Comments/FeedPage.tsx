import { useEffect, useState } from "react";
import PostList from "@/components/comments/PostList";
import commentService from "@/utils/commentService";
import { PostData } from "@/types/postModel";
import { userFromToken } from "@/utils/userFromToken";

export default function FeedPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const currentUser = userFromToken();

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await commentService.getRecentPosts();
        const sorted = [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setPosts(sorted);
      } catch (err) {
        console.error("Error loading global feed:", err);
      }
    }
    loadFeed();
  }, []);

  const handleLikeToggle = async (postId: string) => {
    try {
      const res = await commentService.toggleLike(currentUser.userId, postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId ? { ...p, likes: res.likes, liked: res.liked } : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Global Feed</h2>
      <PostList posts={posts} onLike={handleLikeToggle} type="feed" />
    </div>
  );
}
