import { useState } from 'react';
import LikeButton from './LikeButton';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';
import { CommentData } from '@/types/comment';
import Avatar from '../common/Avatar';

interface Props {
  comment: CommentData;
  onReply: (parentId: string, text: string) => void;
  onLike: (id: string) => void;
}

export default function Comment({ comment, onReply, onLike }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex align-items-start mb-2">
          <Avatar src={comment.userAvatar} />
          <div className="ms-2 flex-grow-1">
            <p className="fw-bold mb-1">{comment.username || 'Anonymous'}</p>
            <p className="mb-2">{comment.text}</p>

            <div className="d-flex gap-2">
              <LikeButton
                likes={comment.likes}
                liked={comment.liked}
                onToggle={() => onLike(comment.id)}
              />
              <button
                className="btn btn-link btn-sm p-0"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </button>
            </div>

            {showReplyForm && (
              <div className="mt-2 ms-3">
                <ReplyForm
                  parentId={comment.id}
                  onSubmit={(text) => {
                    onReply(comment.id, text);
                    setShowReplyForm(false);
                  }}
                />
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="ms-3 mt-2">
                <ReplyList
                  replies={comment.replies}
                  onReply={onReply}
                  onLike={onLike}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
