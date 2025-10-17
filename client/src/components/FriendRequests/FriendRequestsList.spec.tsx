import { render, screen, fireEvent } from "@testing-library/react";
import RespondFriendRequestButton from "./RespondFriendRequestButton";
import DeleteFriendRequestButton from "./DeleteFriendRequestButton";

jest.mock("./RespondFriendRequestButton", () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <button onClick={() => props.onResponse?.("accepted", "patrick")}>Respond</button>
  )),
}));

jest.mock("./DeleteFriendRequestButton", () => ({
  __esModule: true,
  default: jest.fn(({ onDeleted }) => (
    <button onClick={onDeleted}>Delete</button>
  )),
}));

import FriendRequestsList from "./FriendRequestsList";
import { FriendRequest } from "@/hooks/useFriendRequests";

const mockRequests: FriendRequest[] = [
  {
    requestId: "70b7f98e-efa6-4c2c-b756-ede5bdb5095f",
    senderUsername: "patrick",
    receiverUsername: "pearlkrabs",
    status: "pending",
    userId: "df7c4b3d-f108-4697-987a-08027efc1d70",
  },
  {
    requestId: "71c71cdf-f0f3-44ff-8e30-d9098698a5c3",
    senderUsername: "mrkrabs",
    receiverUsername: "spongebob",
    status: "accepted",
    userId: "6e923aad-566c-4524-9bcf-fc8d6d954ee56",
  },
];

const mockOnResponse = jest.fn();
const mockOnFriendAdded = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FriendRequestsList", () => {
  test("renders loading state", () => {
    render(
      <FriendRequestsList
        currentUserId="df7c4b3d-f108-4697-987a-08027efc1d70"
        sent={false}
        requests={[]}
        loading={true}
        activeStatus="pending"
      />
    );
    expect(screen.getByText(/loading requests/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    render(
      <FriendRequestsList
        currentUserId="df7c4b3d-f108-4697-987a-08027efc1d70"
        sent={false}
        requests={[]}
        loading={false}
        error="Something went wrong"
        activeStatus="pending"
      />
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test("renders empty state when no requests match active status", () => {
    render(
      <FriendRequestsList
        currentUserId="df7c4b3d-f108-4697-987a-08027efc1d70"
        sent={false}
        requests={mockRequests}
        loading={false}
        activeStatus="denied"
      />
    );
    expect(screen.getByText(/no denied received requests/i)).toBeInTheDocument();
  });

  test("renders pending requests with buttons", () => {
    render(
      <FriendRequestsList
        currentUserId="df7c4b3d-f108-4697-987a-08027efc1d70"
        sent={false}
        requests={mockRequests}
        loading={false}
        activeStatus="pending"
      />
    );
    expect(screen.getByText(/from: patrick/i)).toBeInTheDocument();
    expect(screen.getByText(/respond/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  test("calls onResponse and onFriendAdded when handleResponse is triggered", () => {
    (RespondFriendRequestButton as jest.Mock).mockImplementation(({ onResponse }) => (
      <button onClick={() => onResponse("accepted", "patrick")}>Respond</button>
    ));

    render(
      <FriendRequestsList
        currentUserId="df7c4b3d-f108-4697-987a-08027efc1d70"
        sent={false}
        requests={mockRequests}
        loading={false}
        activeStatus="pending"
        onResponse={mockOnResponse}
        onFriendAdded={mockOnFriendAdded}
      />
    );

    fireEvent.click(screen.getByText(/respond/i));

    expect(mockOnResponse).toHaveBeenCalledWith("70b7f98e-efa6-4c2c-b756-ede5bdb5095f", "accepted", "patrick");
    expect(mockOnFriendAdded).toHaveBeenCalledWith("patrick");
  });

  test("removes request from list after deletion", () => {
    render(
      <FriendRequestsList
        currentUserId="6e923aad-566c-4524-9bcf-fc8d6d954ee56"
        sent={false}
        requests={mockRequests}
        loading={false}
        activeStatus="pending"
      />
    );

    expect(screen.getByText(/from: patrick/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/delete/i));

    expect(screen.getByText(/no pending received requests/i)).toBeInTheDocument();
  });
});
