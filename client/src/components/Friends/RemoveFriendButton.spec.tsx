import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RemoveFriendButton from "@/components/Friends/RemoveFriendButton";
import friendsService from "@/utils/friendsService";

jest.mock("@/utils/friendsService", () => ({
  __esModule: true,
  default: {
    removeFriend: jest.fn(),
  },
}));

describe("RemoveFriendButton", () => {
  const mockUsername = "patrick";
  const mockFriend = "pearlkrabs";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("button renders", () => {
    render(<RemoveFriendButton username={mockUsername} friendUsername={mockFriend} />);
    expect(screen.getByRole("button", { name: /remove friend/i })).toBeInTheDocument();
  });

  test("calls friendsService.removeFriend on click", async () => {
    (friendsService.removeFriend as jest.Mock).mockResolvedValueOnce({ success: true });

    render(<RemoveFriendButton username={mockUsername} friendUsername={mockFriend} />);
    const button = screen.getByRole("button", { name: /remove friend/i });

    fireEvent.click(button);
    expect(friendsService.removeFriend).toHaveBeenCalledWith(mockUsername, mockFriend);
  });

  test("calls onRemoved callback after removal", async () => {
    (friendsService.removeFriend as jest.Mock).mockResolvedValueOnce({ success: true });
    const mockOnRemoved = jest.fn();

    render(
      <RemoveFriendButton
        username={mockUsername}
        friendUsername={mockFriend}
        onRemoved={mockOnRemoved}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /remove friend/i }));

    await waitFor(() => {
        expect(screen.getByText(/removed/i)).toBeInTheDocument();
    });

    expect(mockOnRemoved).toHaveBeenCalledTimes(1);
    
    expect(friendsService.removeFriend).toHaveBeenCalledWith(mockUsername, mockFriend);
  });

});
