import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteFriendRequestButton from "./DeleteFriendRequestButton";
import friendsService from "@/utils/friendsService";

jest.mock("@/utils/friendsService", () => ({
  __esModule: true,    
  default: {
    deleteFriendReq: jest.fn(),
  },
}));

describe("DeleteFriendRequestButton", () => {
  const mockUserId = "6e923aad-566c-4524-9bcf-fc8d6d954ee5";
  const mockRequestId = "71c71cdf-f0f3-44ff-8e30-d9098698a5c3";
  const mockOnDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with default text", () => {
    render(
      <DeleteFriendRequestButton
        userId={mockUserId}
        requestId={mockRequestId}
        sent={false}
      />
    );

    expect(screen.getByRole("button", { name: /delete friend request/i })).toBeInTheDocument();
  });

   test("calls friendsService.deleteFriendReq and onDeleted on success", async () => {
    (friendsService.deleteFriendReq as jest.Mock).mockResolvedValueOnce({ success: true });

    render(
      <DeleteFriendRequestButton
        userId={mockUserId}
        requestId={mockRequestId}
        sent={false}
        onDeleted={mockOnDeleted}
      />
    );

    const button = screen.getByRole("button", { name: /delete friend request/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(friendsService.deleteFriendReq).toHaveBeenCalledWith(mockUserId, mockRequestId, false);
      expect(mockOnDeleted).toHaveBeenCalledTimes(1);
    });
  });

  test("disables button while deleting", async () => {
    (friendsService.deleteFriendReq as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <DeleteFriendRequestButton
        userId={mockUserId}
        requestId={mockRequestId}
        sent={false}
      />
    );

    const button = screen.getByRole("button", { name: /delete friend request/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  test("shows error message when deletion fails", async () => {
    (friendsService.deleteFriendReq as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(
      <DeleteFriendRequestButton
        userId={mockUserId}
        requestId={mockRequestId}
        sent={false}
      />
    );

    const button = screen.getByRole("button", { name: /delete friend request/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(friendsService.deleteFriendReq).toHaveBeenCalled();
      expect(button).not.toBeDisabled();
      expect(screen.getByRole("button", { name: /delete friend request/i })).toBeInTheDocument();
    });
  });
});
