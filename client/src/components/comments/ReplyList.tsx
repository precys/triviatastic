import Comment from './Comment';
import { CommentData } from '@/types/commentModel';

interface Props {
  replies: CommentData[];
  onReply: (parentId: string, text: string) => void;
  onLike: (id: string) => void;
}

export default function ReplyList({ replies, onReply, onLike }: Props) {
  return (
    <div className="ms-4">
      {replies.map((reply) => (
        <Comment
          key={reply.commentId}
          comment={reply}
          onReply={onReply}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
