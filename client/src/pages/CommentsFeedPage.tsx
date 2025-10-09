import { useState } from 'react';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import { CommentData } from '@/types/comment';

export default function CommentsFeedPage() {
  const [comments, setComments] = useState<CommentData[]>([]);

  const handleAddComment = (text: string) => {
    const newComment: CommentData = {
      id: Date.now().toString(),
      username: '',
      userAvatar: '',
      text,
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments([newComment, ...comments]);
  };

  const handleAddReply = (parentId: string, text: string) => {
    const addReply = (list: CommentData[]): CommentData[] =>
      list.map((c) =>
        c.id === parentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: Date.now().toString(),
                  username: '',
                  userAvatar: '',
                  text,
                  likes: 0,
                  liked: false,
                  replies: [],
                },
              ],
            }
          : { ...c, replies: addReply(c.replies) }
      );
    setComments(addReply(comments));
  };

  const handleLikeToggle = (id: string) => {
    const toggleLike = (list: CommentData[]): CommentData[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : { ...c, replies: toggleLike(c.replies) }
      );
    setComments(toggleLike(comments));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Comments Feed</h1>
      <CommentForm onSubmit={handleAddComment} />
      <CommentList
        comments={comments}
        onReply={handleAddReply}
        onLike={handleLikeToggle}
      />
    </div>
  );
}
