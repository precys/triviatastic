import { render, screen, fireEvent } from "@testing-library/react";
import FriendRequestDropdown from "./FriendRequestDropdown";

jest.mock("@/hooks/useUser", () => ({
  __esModule: true,
  useUser: jest.fn(),
}));

import { useUser } from "@/hooks/useUser";

jest.mock("@/components/FriendRequests/SendFriendRequestButton", () => ({
  __esModule: true,
  default: jest.fn(({ receiverUsername }) => (
    <button>Send Request to {receiverUsername}</button>
  )),
}));

jest.mock("../Friends/RemoveFriendButton", () => ({
  __esModule: true,
  default: jest.fn(({ friendUsername, onRemoved }) => (
    <button onClick={onRemoved}>Remove {friendUsername}</button>
  )),
}));

const mockCurrentUser = { userId: "aa6c3f6c-2da8-465d-aac3-17c6be3f91ee", username: "spongebob" };
const mockUsers = [
  { userId: "aa6c3f6c-2da8-465d-aac3-17c6be3f91ee", username: "spongebob" },
  { userId: "df7c4b3d-f108-4697-987a-08027efc1d70", username: "patrick" },
  { userId: "045ceedf-83a8-478b-9409-ca261cffbe42", username: "squidward" },
];
const mockSetSelectedUserId = jest.fn();
const mockOnFriendRemoved = jest.fn();

describe("FriendRequestDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dropdown with sorted users excluding current user", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(
      <FriendRequestDropdown
        currentUser={mockCurrentUser}
        users={mockUsers}
        selectedUserId=""
        setSelectedUserId={mockSetSelectedUserId}
        friendsList={[]}
      />
    );

    expect(screen.getByLabelText(/select a user/i)).toBeInTheDocument();

    expect(screen.queryByText(/spongebob/i)).not.toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual([
      "-- Select a User --",
      "patrick",
      "squidward",
    ]);
  });

  test("calls setSelectedUserId when a user is chosen", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(
      <FriendRequestDropdown
        currentUser={mockCurrentUser}
        users={mockUsers}
        selectedUserId="" // controlled
        setSelectedUserId={mockSetSelectedUserId}
        friendsList={[]}
      />
    );
    const select = screen.getByLabelText(/select a user/i);

    fireEvent.change(select, { target: { value: "df7c4b3d-f108-4697-987a-08027efc1d70" } });

    expect(mockSetSelectedUserId).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedUserId).toHaveBeenCalledWith("df7c4b3d-f108-4697-987a-08027efc1d70");
  });

  test("renders SendFriendRequestButton when selected user is not a friend", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { userId: "2", username: "patrick" },
    });

    render(
      <FriendRequestDropdown
        currentUser={mockCurrentUser}
        users={mockUsers}
        selectedUserId="2"
        setSelectedUserId={mockSetSelectedUserId}
        friendsList={["squidward"]} 
      />
    );

    expect(screen.getByText(/send request to patrick/i)).toBeInTheDocument();
  });

  test("renders RemoveFriendButton when selected user is a friend", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { userId: "3", username: "squidward" },
    });

    render(
      <FriendRequestDropdown
        currentUser={mockCurrentUser}
        users={mockUsers}
        selectedUserId="3"
        setSelectedUserId={mockSetSelectedUserId}
        friendsList={["squidward"]} 
        onFriendRemoved={mockOnFriendRemoved}
      />
    );

    const removeBtn = screen.getByText(/remove squidward/i);
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);
    expect(mockOnFriendRemoved).toHaveBeenCalledWith("squidward");
  });

  test("renders nothing below dropdown if no user is selected", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(
      <FriendRequestDropdown
        currentUser={mockCurrentUser}
        users={mockUsers}
        selectedUserId=""
        setSelectedUserId={mockSetSelectedUserId}
        friendsList={[]}
      />
    );

    expect(screen.queryByText(/send request/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument();
  });
});
