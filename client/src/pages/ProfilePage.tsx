import { useState } from 'react';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import { CommentData } from '@/types/comment';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'feed'>('profile');
  const [profileComments, setProfileComments] = useState<CommentData[]>([]);
  const [feedComments, setFeedComments] = useState<CommentData[]>([]);

  // add new comment to the correct list
  const handleAddComment = (text: string, type: 'profile' | 'feed') => {
    const newComment: CommentData = {
      id: Date.now().toString(),
      username: '',
      userAvatar: '',
      text,
      likes: 0,
      liked: false,
      replies: [],
    };
    if (type === 'profile') setProfileComments([newComment, ...profileComments]);
    else setFeedComments([newComment, ...feedComments]);
  };

  // add reply to the correct list
  const handleAddReply = (parentId: string, text: string, type: 'profile' | 'feed') => {
    const updateReplies = (list: CommentData[]): CommentData[] =>
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
          : { ...c, replies: updateReplies(c.replies) }
      );

    if (type === 'profile') setProfileComments(updateReplies(profileComments));
    else setFeedComments(updateReplies(feedComments));
  };

  // toggle like in the correct list
  const handleLikeToggle = (id: string, type: 'profile' | 'feed') => {
    const toggleLike = (list: CommentData[]): CommentData[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : { ...c, replies: toggleLike(c.replies) }
      );

    if (type === 'profile') setProfileComments(toggleLike(profileComments));
    else setFeedComments(toggleLike(feedComments));
  };

  return (
    <div className="container mt-4">
      {/* top third: profile info */}
      <div className="mb-4 p-3 border rounded">
        <h2>Profile Info</h2>
        <p>Avatar, name, bio, stats, etc. will go here.</p>
      </div>

      {/* tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Comments
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            Feed Comments
          </button>
        </li>
      </ul>

      {/* tab content */}
      {activeTab === 'profile' && (
        <>
          <CommentForm onSubmit={(text) => handleAddComment(text, 'profile')} />
          <CommentList
            comments={profileComments}
            onReply={(parentId, text) => handleAddReply(parentId, text, 'profile')}
            onLike={(id) => handleLikeToggle(id, 'profile')}
          />
        </>
      )}
      {activeTab === 'feed' && (
        <>
          <CommentForm onSubmit={(text) => handleAddComment(text, 'feed')} />
          <CommentList
            comments={feedComments}
            onReply={(parentId, text) => handleAddReply(parentId, text, 'feed')}
            onLike={(id) => handleLikeToggle(id, 'feed')}
          />
        </>
      )}
    </div>
  );
}
