import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendFriendRequestButton from "./SendFriendRequestButton";
import friendsService from "@/utils/friendsService";

jest.mock("@/utils/friendsService", () => ({
  __esModule: true,
  default: {
    getFriendRequestsStatus: jest.fn(),
    sendFriendReq: jest.fn(),
  },
}));

describe("SendFriendRequestButton", () => {
  const mockSender = "patrick";
  const mockReceiver = "sandy";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders 'Checking...' first and then 'Send Friend Request' when status is not_sent", async () => {
    (friendsService.getFriendRequestsStatus as jest.Mock).mockResolvedValueOnce("not_sent");

    render(<SendFriendRequestButton senderId={mockSender} receiverUsername={mockReceiver} />);

    expect(screen.getByRole("button")).toHaveTextContent(/checking/i);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent(/send friend request/i);
    });
  });

  test("renders 'Request Pending' when status is pending", async () => {
    (friendsService.getFriendRequestsStatus as jest.Mock).mockResolvedValueOnce("pending");

    render(<SendFriendRequestButton senderId={mockSender} receiverUsername={mockReceiver} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent(/request pending/i);
    });
  });

  test("renders 'Sent' when status is accepted", async () => {
    (friendsService.getFriendRequestsStatus as jest.Mock).mockResolvedValueOnce("accepted");

    render(<SendFriendRequestButton senderId={mockSender} receiverUsername={mockReceiver} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent(/sent/i);
    });
  });

  test("renders 'Send Again' when status is denied", async () => {
    (friendsService.getFriendRequestsStatus as jest.Mock).mockResolvedValueOnce("denied");

    render(<SendFriendRequestButton senderId={mockSender} receiverUsername={mockReceiver} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent(/send again/i);
    });
  });

  test("handles send request successfully and calls onRequestSent", async () => {
    (friendsService.getFriendRequestsStatus as jest.Mock).mockResolvedValueOnce("not_sent");
    (friendsService.sendFriendReq as jest.Mock).mockResolvedValueOnce({ status: "pending" });

    const mockOnRequestSent = jest.fn();

    render(
      <SendFriendRequestButton
        senderId={mockSender}
        receiverUsername={mockReceiver}
        onRequestSent={mockOnRequestSent}
      />
    );

    // Wait until initial status resolves
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent(/send friend request/i);
    });

    fireEvent.click(screen.getByRole("button", { name: /send friend request/i }));

    await waitFor(() => {
      expect(friendsService.sendFriendReq).toHaveBeenCalledWith(mockSender, mockReceiver);
      expect(mockOnRequestSent).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button")).toHaveTextContent(/request pending/i);
    });
  });

  test("disables button when request is pending or sent", async () => {
    (friendsService.getFriendRequestsStatus as jest.Mock).mockResolvedValueOnce("pending");

    render(<SendFriendRequestButton senderId={mockSender} receiverUsername={mockReceiver} />);

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/request pending/i);
    });
  });
});
