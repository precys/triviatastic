import { useEffect, useState } from "react";
import CommentForm from "@/components/comments/CommentForm";
import PostList from "@/components/comments/PostList";
import { PostData } from "@/types/postModel";
import commentService from "@/utils/commentService";
import { getUserStats } from "@/utils/userService";
import { userFromToken } from "@/utils/userFromToken";
import { useParams } from "react-router-dom";
import AuthentificationHook from "@/components/Context/AuthentificationHook";
// import UserList from "@/components/FriendRequests/UserList";
import FriendsList from "@/components/Friends/FriendsList";
import "./ProfilePage.css";
import FriendRequestsList from "@/components/FriendRequests/FriendRequestsList";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import SendFriendRequestButton from "@/components/FriendRequests/SendFriendRequestButton";
import RemoveFriendButton from "@/components/Friends/RemoveFriendButton";
import friendsService from "@/utils/friendsService";

export default function ProfilePage() {
  // Andrew comments for clarifications
  // Field initialized for userId, username: changes depending on if look at own profile or another user's profile
  let userId;
  let username;
  // Gonna have to use some fields from currently logged in user. Initialize. Might need a name change for dev sake.
  const currentUser = userFromToken();
  // Deconstruct authentificationhook for users arraylist
  const { users } = AuthentificationHook();
  // Try to get value from username path parameter
  const { username: paramUsername } = useParams<{ username: string }>();


  // Simple if-conditional, if pathUsername is undefined, meaning no :username path param, access page for /profile
  if (paramUsername){
    // If paramUsername does have value, meaning /path/:username, do below logic
    const user = users.find(user => user.username === paramUsername)
    userId = user?.userId;
    username = user?.username;
  }
  else{
    // else handle normally.
    userId = currentUser.userId;
    username = currentUser.username;
  }
  // checks if the user looking at their own profile
  const isOwnProfile = currentUser.username === username;

  // checking friendship status 
  const [isFriend, setIsFriend] = useState(false);
  const [loadingFriendStatus, setLoadingFriendStatus] = useState(true);
  
  useEffect(() =>{
    if(!currentUser?.userId || !username || isOwnProfile) return;
      const fetchFriendsStatus = async () => {
        try{
          setLoadingFriendStatus(true);
          const friendData = await friendsService.getFriends(currentUser.userId ?? "");
          setIsFriend(friendData.friends.includes(username));
          setLoadingFriendStatus(false);
        }catch(err){
          console.error("Error checking friend status:", err);
        }
      };
      fetchFriendsStatus();
  }, [currentUser?.userId, username, isOwnProfile])

  const [activeTab, setActiveTab] = useState<"myPosts" | "friendsFeed">("myPosts");
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const [friendsPosts, setFriendsPosts] = useState<PostData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const currentUserId = userId || "";

  // tabs for friend requests
  const [activeRequestTab, setActiveRequestTab] = useState<'received' | 'sent'>('received');
  const [activeStatus, setActiveStatus] = useState<"pending" | "accepted" | "denied">("pending");

  // Load friend request data
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

  // sort helper - newest first
  const sortPostsNewestFirst = (posts: PostData[]) =>
    [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // fetch user's posts
  const loadUserPosts = async () => {
    if (!currentUserId) return;
    try {
      const data = await commentService.getPosts(currentUserId);
      const posts = Array.isArray(data) ? data : [];
      setUserPosts(sortPostsNewestFirst(posts));
    } catch (err) {
      console.error("Error loading user posts:", err);
    }
  };

  // fetch friends' posts
  const loadFriendsPosts = async () => {
    if (!currentUserId) return;
    try {
      const data = await commentService.getFriendsPosts(currentUserId);
      const posts = Array.isArray(data) ? data : [];
      setFriendsPosts(sortPostsNewestFirst(posts));
    } catch (err) {
      console.error("Error loading friends posts:", err);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;
    loadUserPosts();
    loadFriendsPosts();
  }, [currentUserId]);

  // load user stats
  useEffect(() => {
    if (!currentUserId) return;
    getUserStats(currentUserId)
      .then((s) => setStats(s))
      .catch((err) => console.error("Error fetching stats:", err));
  }, [currentUserId]);

  // create a new post
  const handleAddPost = async (content: string, type: "myPosts" | "friendsFeed") => {
    if (!currentUserId || !content.trim()) return;
    try {
      // Construct the body depending on own profile, or visiting another user's profile.
      if (paramUsername){
        const body = {
          content,
          profileId: currentUserId,
        }
        await commentService.addPost(currentUser.userId || "", body);
      }
      else{
        const body = {
          content,
        }
        await commentService.addPost(currentUserId, body);
      }
      
      if (type === "myPosts") await loadUserPosts();
      else await loadFriendsPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  // toggle like
  const handleLikeToggle = async (id: string, type: "myPosts" | "friendsFeed") => {
    if (!currentUserId) return;

      try {
      const res = await commentService.toggleLike(currentUserId, id);
      const updatedLikes = res.likes;
      const updatedLiked = res.liked;

      const updatePosts = (posts: PostData[]) =>
        posts.map((p) =>
          p.postId === id
            ? { ...p, likes: updatedLikes, liked: updatedLiked }
            : p
        );

      if (type === "myPosts") setUserPosts((prev) => updatePosts(prev));
      else setFriendsPosts((prev) => updatePosts(prev));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };


  return (
    <div className="container mt-4">
      {/* profile header */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex flex-column flex-md-row align-items-center gap-3">
          <img src="/default-avatar.png" alt="avatar" className="rounded-circle profile-avatar" />
          <div className="flex-grow-1">
            <h3 className="card-title">{username || "Loading..."}</h3>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <span className="badge bg-primary">Posts: {userPosts.length}</span>
              <span className="badge bg-info text-dark">Friends: {stats?.friend_count ?? 0}</span>
            </div>
          </div>
          {/*  Send Friend Request only if not own profile */}
            {!isOwnProfile && username && (
              <div className="ms-auto">
                {loadingFriendStatus? (
                  <span className="text-muted">Checking friendship...</span>
                ) : isFriend? (
                  <RemoveFriendButton 
                    username={currentUser.username ?? ""}
                    friendUsername={username}
                    onRemoved={() => setIsFriend(false)}
                  />
                ) : (
                  <SendFriendRequestButton
                    senderId={currentUser?.userId ?? ""}
                    receiverUsername={username}
                    onRequestSent={() =>
                      console.log("Friend request sent successfully")
                      // setIsFriend(true);
                    }
                  />
                )}
              </div>
            )}
        </div>
      </div>

      {/* stats cards */}
      {stats && (
        <div className="row g-2 mb-4">
          <div className="col-sm-6 col-md-3">
            <div className="card text-white bg-primary p-2 shadow-sm text-center">
              <h6 className="mb-1">High Score</h6>
              <p className="fs-5 mb-0">{stats.hi_score ?? 0}</p>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card text-white bg-success p-2 shadow-sm text-center">
              <h6 className="mb-1">Games Played</h6>
              <p className="fs-5 mb-0">{stats.game_count ?? 0}</p>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card text-white bg-warning p-2 shadow-sm text-center">
              <h6 className="mb-1">Streak</h6>
              <p className="fs-5 mb-0">{stats.streak ?? 0}</p>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card text-white bg-info p-2 shadow-sm text-center">
              <h6 className="mb-1">Easy / Med / Hard</h6>
              <p className="fs-5 mb-0">
                {stats.easy_count ?? 0} / {stats.med_count ?? 0} / {stats.hard_count ?? 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* friends + friend requests */}
      <div className="mb-4">
        {/* <h3>Friends</h3> */}
        <FriendsList userId={currentUserId} />
        {/* <h4>Add new friends</h4>
        <UserList userId={currentUserId} /> */}
        
        <h4>Manage Friend Requests</h4>
        {/* Received / Sent Tabs */}
        <ul className="nav nav-tabs mb-3">
          {(["received", "sent"] as const).map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeRequestTab === tab ? "active" : ""}`}
                onClick={() => setActiveRequestTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        {/* Status Filter */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          {(["pending", "accepted", "denied"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`btn btn-sm ${
                activeStatus === status
                  ? status === "pending"
                    ? "btn-warning text-white"
                    : status === "accepted"
                    ? "btn-success text-white"
                    : "btn-danger text-white"
                  : "btn-outline-secondary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Description */}
        <p className="text-muted small mb-3 text-center">
          {activeRequestTab === "received"
            ? activeStatus === "pending"
              ? "Pending requests you need to respond to."
              : activeStatus === "accepted"
              ? "Requests you've accepted."
              : "Requests you've denied."
            : activeStatus === "pending"
            ? "Users that have not responded yet."
            : activeStatus === "accepted"
            ? "Users who accepted your requests."
            : "Users who denied your requests."}
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
            console.log(`Request ${id} updated to ${status}`)
          }
        />
          
      </div>

      {/* tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "myPosts" ? "active" : ""}`}
            onClick={() => setActiveTab("myPosts")}
          >
            My Posts
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "friendsFeed" ? "active" : ""}`}
            onClick={() => setActiveTab("friendsFeed")}
          >
            Friends Feed
          </button>
        </li>
      </ul>

      {/* content */}
      {activeTab === "myPosts" && (
        <>
          <CommentForm onSubmit={(content) => handleAddPost(content, "myPosts")} />
          <PostList posts={userPosts} onLike={handleLikeToggle} type="myPosts" />
        </>
      )}

      {activeTab === "friendsFeed" && (
        <PostList posts={friendsPosts} onLike={handleLikeToggle} type="friendsFeed" />
      )}
    </div>
  );
}
