import { useUser, User } from "@/hooks/useUser";
import SendFriendRequestButton from '@/components/FriendRequests/SendFriendRequestButton';
import RemoveFriendButton from '../Friends/RemoveFriendButton';

interface FriendRequestProps {
  currentUser: User;
  users: User[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  friendsList: string []; // list of current friends usernames
  onFriendRemoved?: (username: string) => void; // callback when a friend is removed
}

export default function FriendRequestDropdown({ currentUser, users, selectedUserId, setSelectedUserId, friendsList = [], onFriendRemoved}: FriendRequestProps) {
  
  const { user: selectedUser } = useUser(selectedUserId || "");

    // check if selected user is already a friend
    const isFriend = selectedUser ? friendsList.includes(selectedUser.username) : false;

    // Sorts users alphabetically by username
    const sortedUsers = users
      .filter((u) => u.userId !== currentUser.userId)
      .sort((a, b) => a.username.localeCompare(b.username));

      console.log("CURRENTUSER: ", currentUser.userId);

  return (
    <div className="p-3 border rounded mb-3">
      <label htmlFor="friendSelect" className="block mb-2 font-semibold">
        Select a User
      </label>

      {/* Dropdown to select a user */}
      <select
        id="friendSelect"
        className="border p-2 rounded w-full"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">-- Select a User --</option>
        {sortedUsers.map((u) => (
          <option key={u.userId} value={u.userId}>
            {u.username}
          </option>
        ))}
      </select>

      {selectedUser && (
        <div className="mt-2 flex justify-between items-center p-2 border rounded bg-gray-50">
          <span>{selectedUser.username}</span>

          {isFriend ? (
            <RemoveFriendButton
              username={currentUser.username}
              friendUsername={selectedUser.username}
              onRemoved={() => {
                if (onFriendRemoved) onFriendRemoved(selectedUser.username);
              }}
            />
          ) : (
            <SendFriendRequestButton
              senderId={currentUser.userId}
              receiverUsername={selectedUser.username}
              onRequestSent={() =>
                console.log(`Friend request sent to ${selectedUser.username}`)
              }
            />
          )}
        </div>
      )}
    </div>
  )
}
