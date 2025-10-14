import { useEffect, useState } from "react";
import commentService from "@/utils/commentService";
import "./CommentsFeedPage.css";

interface CommentData {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  likes: number;
}

function CommentsFeedPage() {
  const [recentPosts, setRecentPosts] = useState<CommentData[]>([]);

  useEffect(() => {
    commentService.getRecentPosts().then(setRecentPosts);
  }, []);

  return (
    <div className="feed-page">
      <h1 className="feed-header">Recent Posts</h1>
      <div className="comments-feed">
        {recentPosts.map((c) => (
          <div key={c.id} className="comment-card">
            <div className="comment-header">
              <strong>{c.username}</strong> • <span>{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <div className="comment-body">{c.text}</div>
            <div className="comment-footer">Likes: {c.likes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsFeedPage;
