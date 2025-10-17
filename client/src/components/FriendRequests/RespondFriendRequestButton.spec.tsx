import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RespondFriendRequestButton from "./RespondFriendRequestButton";
import axiosClient from "@/utils/axiosClient";
import friendsService from "@/utils/friendsService";

jest.mock("@/utils/axiosClient", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
  },
}));

jest.mock("@/utils/friendsService", () => ({
  __esModule: true,
  default: {
    respondToFriendReq: jest.fn(),
  },
}));

describe("RespondFriendRequestButton", () => {
  const mockSenderId = "6e923aad-566c-4524-9bcf-fc8d6d954ee5";
  const mockReceiverId = "aa6c3f6c-2da8-465d-aac3-17c6be3f91ee";
  const mockSenderUsername = "mrkrabs";
  const mockRequestId = "71c71cdf-f0f3-44ff-8e30-d9098698a5c3";

  const mockOnResponse = jest.fn();
  const mockOnFriendAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

 test("handles successful accept request", async () => {
    (axiosClient.put as jest.Mock).mockResolvedValue({ data: { message: "ok" } });
    (friendsService.respondToFriendReq as jest.Mock).mockResolvedValueOnce({ status: "accepted" });

    render(
      <RespondFriendRequestButton
        senderId={mockSenderId}
        senderUsername={mockSenderUsername}
        receiverId={mockReceiverId}
        requestId={mockRequestId}
        onResponse={mockOnResponse}
        onFriendAdded={mockOnFriendAdded}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /accept/i }));

    await waitFor(() => {
      expect(screen.getByText(/accepted/i)).toBeInTheDocument();
      expect(friendsService.respondToFriendReq).toHaveBeenCalledWith(
        mockReceiverId,
        mockRequestId,
        "accepted"
      );
      expect(mockOnResponse).toHaveBeenCalledWith("accepted", mockSenderUsername);
      expect(mockOnFriendAdded).toHaveBeenCalledWith(mockSenderUsername);
    });
  });

  test("handles successful deny request", async () => {
    (axiosClient.put as jest.Mock).mockResolvedValue({ data: { message: "ok" } });
    (friendsService.respondToFriendReq as jest.Mock).mockResolvedValue({ status: "denied" });

    render(
      <RespondFriendRequestButton
        senderId={mockSenderId}
        senderUsername={mockSenderUsername}
        receiverId={mockReceiverId}
        requestId={mockRequestId}
        onResponse={mockOnResponse}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /deny/i }));

    await waitFor(() => {
      expect(screen.getByText(/denied/i)).toBeInTheDocument();
      expect(friendsService.respondToFriendReq).toHaveBeenCalledWith(
        mockReceiverId,
        mockRequestId,
        "denied"
      );
      expect(mockOnResponse).toHaveBeenCalledWith("denied", mockSenderUsername);
    });
  });

  test("disables buttons while loading", async () => {
    (axiosClient.put as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100))
    );
    (friendsService.respondToFriendReq as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: "accepted" }), 100))
    );

    render(
      <RespondFriendRequestButton
        senderId={mockSenderId}
        senderUsername={mockSenderUsername}
        receiverId={mockReceiverId}
        requestId={mockRequestId}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /accept/i }));

    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());

    await waitFor(() => {
      expect(screen.getByText(/accepted/i)).toBeInTheDocument();
    });
  });

});
