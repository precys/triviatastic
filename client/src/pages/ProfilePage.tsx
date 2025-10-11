import { useEffect, useState } from 'react';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import { CommentData } from '@/types/comment';
import { useParams } from 'react-router-dom';
import FriendsList from '@/components/Friends/FriendsList';
import UserInfo from '@/components/UserProfile/UserInfo';
import { User } from "@/hooks/useUser";
import { useAllUsers } from "@/hooks/useAllUsers";
import axios from 'axios';
import UsersList from '@/components/Friends/UsersList';
import FriendRequestDropdown from '@/components/FriendRequests/FriendRequestDropdown';
import FriendRequestsList from '@/components/FriendRequests/FriendRequestsList';
import SendFriendRequestButton from '@/components/FriendRequests/SendFriendRequestButton';
import RespondFriendRequestButton from '@/components/FriendRequests/RespondFriendRequestButton';
import { useFriendRequests } from '@/hooks/useFriendRequests';

interface ProfilePageProps {
  currentUserId: string; // logged-in user
}

export default function ProfilePage({ currentUserId }: ProfilePageProps) {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const userId = paramUserId || currentUserId; // fallback to logged-in user

  if (!userId) return <p>User not found</p>;

  const [activeTab, setActiveTab] = useState<'profile' | 'feed'>('profile');
  const [profileComments, setProfileComments] = useState<CommentData[]>([]);
  const [feedComments, setFeedComments] = useState<CommentData[]>([]);

  const { users, loading } = useAllUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  //tabs for friend requests
  const [activeRequestTab, setActiveRequestTab] = useState<'received' | 'sent'>('received');
  const [activeStatus, setActiveStatus] = useState<"pending" | "accepted" | "denied">("pending");

   // friend request data
  const {
    requests: receivedRequests,
    loading: loadingReceived,
    error: errorReceived,
  } = useFriendRequests(currentUserId, activeStatus, false);

  const {
    requests: sentRequests,
    loading: loadingSent,
    error: errorSent,
  } = useFriendRequests(currentUserId, activeStatus, true);


  if (loading) return <p>Loading users...</p>;

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
        <UserInfo userId={userId} />
        <FriendsList userId={userId} />
        {/* {userId !== currentUserId && <FriendRequestButton senderId={currentUserId} receiverId={userId} />} */}
        {/* {userId === currentUserId && <UserList userId={currentUserId} />} */}
        <FriendRequestDropdown
            senderId={currentUserId}
            users={users}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
          {userId !== currentUserId && selectedUserId && users.find(u => u.userId === selectedUserId)?.username && (
            <SendFriendRequestButton
              senderId={currentUserId}
              receiverId={selectedUserId}
              receiverUsername={users.find(u => u.userId === selectedUserId)?.username}
              // onSuccess={() => refreshSent()}
            />
          )}
      </div>

       {/* Friend Requests */}
      <div className="mb-4 p-3 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-3">Friend Requests</h3>

        {/* Received / Sent tabs */}
        <div className="flex space-x-2 mb-2">
          {(["received", "sent"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 rounded ${
                activeRequestTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveRequestTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex mb-2 space-x-2 justify-center">
          {(["pending", "accepted", "denied"] as const).map((status) => (
            <button
              key={status}
              className={`px-3 py-1 rounded ${
                activeStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Description */}
        <p className="text-sm text-gray-500 mb-4">
          {activeRequestTab === "received"
            ? activeStatus === "pending"
              ? "Pending requests to respond to"
              : activeStatus === "accepted"
              ? "Friend requests you have accepted"
              : "Friend requests you have denied"
            : activeStatus === "pending"
            ? "Users that have not responded to your friend requests yet"
            : activeStatus === "accepted"
            ? "Users that accepted your friend requests"
            : "Users that denied your friend requests"}
        </p>

        {/* FriendRequestsList */}
        <FriendRequestsList
          currentUserId={currentUserId}
          sent={activeRequestTab === "sent"}
          requests={activeRequestTab === "received" ? receivedRequests : sentRequests}
          loading={activeRequestTab === "received" ? loadingReceived : loadingSent}
          error={activeRequestTab === "received" ? errorReceived ?? "" : errorSent ?? ""}
          activeStatus={activeStatus}
          onResponse={(id, status) =>
            console.log(
              `${activeRequestTab === "received" ? "Received" : "Sent"} request ${id} marked as ${status}`
            )
          }
        />
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
