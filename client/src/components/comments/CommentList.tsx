import Comment from './Comment';
import { CommentData } from '@/types/commentModel';

interface Props {
  comments: CommentData[];
  onReply: (parentId: string, content: string) => void;
  onLike: (id: string) => void;
}

export default function CommentList({ comments, onReply, onLike }: Props) {
  if (!comments || comments.length === 0) return <p className="text-muted">No comments yet.</p>;

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Comment key={comment.commentId} comment={comment} onReply={onReply} onLike={onLike} />
      ))}
    </div>
  );
}
