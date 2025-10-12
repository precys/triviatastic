import { PostData } from "@/types/postModel";

interface PostListProps {
  posts: PostData[];
  onLike: (id: string, type: "myPosts" | "friendsFeed") => void;
  type: "myPosts" | "friendsFeed";
}

export default function PostList({ posts, onLike, type }: PostListProps) {
  if (!posts?.length) {
    return <p className="text-muted">No posts yet.</p>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <div key={post.postId} className="card shadow-sm">
          <div className="card-body">
            {/* Header */}
            <div className="d-flex align-items-center mb-2">
              <img
                src={post.userAvatar || "/default-avatar.png"}
                alt="avatar"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <strong>{post.username || "Unknown User"}</strong>
                <div className="text-muted small">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="mb-3">{post.content}</p>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3">
                <button
                    className={`btn btn-sm ${post.liked ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => onLike(post.postId, type)}
                >
                    {post.likes ?? 0} Likes
                </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
