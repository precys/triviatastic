import { useState } from 'react';
import { CommentData } from '@/types/commentModel';
import LikeButton from './LikeButton';
import ReplyForm from './ReplyForm';
import CommentList from './CommentList';
import Avatar from '../common/Avatar';

interface Props {
  comment: CommentData;
  onReply: (parentId: string, content: string) => void;
  onLike: (id: string) => void;
}

export default function Comment({ comment, onReply, onLike }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex align-items-start mb-2">
          <Avatar src={comment.userAvatar || '/default-avatar.png'} />
          <div className="ms-2 flex-grow-1">
            <p className="fw-bold mb-1">{comment.username}</p>
            <p className="mb-2">{comment.content}</p>

            <div className="d-flex gap-2 mb-1">
              <LikeButton likes={comment.likes || 0} liked={comment.liked || false} onToggle={() => onLike(comment.commentId)} />
              <button className="btn btn-link btn-sm p-0" onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
            </div>

            {showReplyForm && (
              <div className="mt-2 ms-3">
                <ReplyForm parentId={comment.commentId} onSubmit={(content) => { onReply(comment.commentId, content); setShowReplyForm(false); }} />
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="ms-4 mt-2 border-start ps-2">
                <CommentList comments={comment.replies} onReply={onReply} onLike={onLike} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
