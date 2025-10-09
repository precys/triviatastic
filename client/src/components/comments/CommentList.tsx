import Comment from './Comment';
import { CommentData } from '@/types/comment';

interface Props {
  comments: CommentData[];
  onReply: (parentId: string, text: string) => void;
  onLike: (id: string) => void;
}

export default function CommentList({ comments, onReply, onLike }: Props) {
  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
